package lib

import (
	"encoding/xml"
	"fmt"
	"io"
	"io/ioutil"
	"math"
	"net/url"
	"os"
	"reflect"
	"strconv"
	"strings"

	"github.com/franela/goreq"
)

var log = NewLogger()

const requestSlice = 10.0

// JenkinsClient - Wrapper for jenkins connection
type JenkinsClient struct {
	URL string
}

type jobsResponse struct {
	Wrapper string              `xml:"jobs"`
	Jobs    []jobPreviewElement `xml:"job"`
}

type buildsResponse struct {
	Wrapper string                `xml:"builds"`
	Builds  []buildPreviewElement `xml:"build"`
}

type buildResponse struct {
	Wrapper xml.Name `xml:"build"`
	buildPreviewElement
}

type consoleResponse struct {
	Offset string `json:"offset"`
	More   bool   `json:"more"`
	Output string `json:"output"`
}

type jobPreviewElement struct {
	Name string `xml:"name" json:"name"`
}

type buildPreviewElement struct {
	Number    int    `xml:"number" json:"number"`
	Building  bool   `xml:"building" json:"building"`
	Result    string `xml:"result" json:"result"`
	URL       string `xml:"url" json:"url"`
	Duration  int    `xml:"duration" json:"duration"`
	Timestamp int    `xml:"timestamp" json:"timestamp"`
	Estimated int    `xml:"estimatedDuration" json:"estimated"`
}

type forkedResponse struct {
	page int
	data interface{}
}

// GetJenkinsClient - Returns jenkins client using environment configured attributes
func GetJenkinsClient() *JenkinsClient {
	jenkinsURL := os.Getenv("JENKINS_URL")
	if jenkinsURL == "" {
		jenkinsURL = "http://localhost:8080"
	}

	return &JenkinsClient{URL: jenkinsURL}
}

// GetJobs - return the configured jobs for this jenkins instance
func (j *JenkinsClient) GetJobs() ([]jobPreviewElement, error) {
	jobs := makeForkedRequest(j.getJobs)
	jobElements := make([]jobPreviewElement, len(jobs))

	for i, elem := range jobs {
		jobElements[i] = elem.(jobPreviewElement)
	}

	return jobElements, nil
}

func (j *JenkinsClient) getJobs(responseChan chan forkedResponse, page int) {
	startingIndex := page * requestSlice
	endingIndex := (page + 1) * requestSlice

	raw := j.get("api", map[string]string{
		"tree":    fmt.Sprintf("jobs[name]{%d,%d}", startingIndex, endingIndex),
		"wrapper": "jobs",
	})

	jobs := new(jobsResponse)
	if err := fromXMLTo(raw, jobs); err != nil {
		log.Errorf("Error unmarshalling jobs response: %s", err)
		responseChan <- forkedResponse{
			data: []jobPreviewElement{},
		}
	}

	responseChan <- forkedResponse{
		page: page,
		data: jobs.Jobs,
	}
}

// GetBuilds - http://localhost:8080/api/xml?tree=jobs[name,builds[number,building,result,url,duration,estimated,timestamp]]&xpath=//job[name[.=%22prod_build%22]]/build&wrapper=builds
func (j *JenkinsClient) GetBuilds(jobName string) ([]buildPreviewElement, error) {
	jobBuildsXpath := fmt.Sprintf("//job[name[.=\"%s\"]]/build", jobName)

	raw := j.get("api", map[string]string{
		"tree":    "jobs[name,builds[number,building,result,url,duration,estimatedDuration,timestamp]]",
		"xpath":   jobBuildsXpath,
		"wrapper": "builds",
	})

	builds := new(buildsResponse)
	if err := fromXMLTo(raw, builds); err != nil {
		log.Error(err)
		return nil, err
	}

	response := []buildPreviewElement{}

	if len(builds.Builds) > 0 {
		response = builds.Builds
	}

	return response, nil
}

// GetBuild - return information about the build defined by a given job name and job number
func (j *JenkinsClient) GetBuild(jobName string, id int) (buildPreviewElement, error) {
	buildXpath := fmt.Sprintf("//job[name[.=\"%s\"]]/build[number[.=%d]]", jobName, id)

	raw := j.get("api", map[string]string{
		"tree":  "jobs[name,builds[number,building,result,url]]",
		"xpath": buildXpath,
	})

	build := new(buildResponse)
	if err := fromXMLTo(raw, build); err != nil {
		log.Error(err)
		return buildPreviewElement{}, err
	}

	return build.buildPreviewElement, nil
}

// GetProgressiveConsoleOutput - http://localhost:8080/job/prod_build/7/logText/progressiveHtml?start=0
// This request is special, because we actually want to service one of the response headers
func (j *JenkinsClient) GetProgressiveConsoleOutput(jobName string, id int, offset string) consoleResponse {
	uriString := []string{j.URL, "job", jobName, strconv.Itoa(id), "logText", "progressiveHtml"}

	res, _ := goreq.Request{
		Uri: strings.Join(uriString, "/"),
		QueryString: toQueryParams(map[string]string{
			"start": offset,
		}),
	}.Do()

	output, _ := res.Body.ToString()

	return consoleResponse{
		Offset: res.Header.Get("X-Text-Size"),
		More:   res.Header.Get("X-More-Data") != "",
		Output: output,
	}
}

func (j *JenkinsClient) get(uri string, params map[string]string) *goreq.Body {
	log.Infof("Requesting uri: '%s' with params: %s", uri, params)

	res, _ := goreq.Request{
		Uri:         strings.Join([]string{j.URL, uri, "xml"}, "/"),
		QueryString: toQueryParams(params),
	}.Do()

	return res.Body
}

func fromXMLTo(raw io.Reader, out interface{}) error {
	if body, err := ioutil.ReadAll(raw); err != nil {
		fmt.Println("Reading generated an error")
		return err
	} else if err := xml.Unmarshal(body, out); err != nil {
		fmt.Println("Unmarshaling generated an error")
		return err
	}

	return nil
}

func toQueryParams(params map[string]string) url.Values {
	qsValues := url.Values{}

	for key, value := range params {
		qsValues.Set(key, value)
	}

	return qsValues
}

func makeForkedRequest(handler func(chan forkedResponse, int)) []interface{} {
	requestsChan := make(chan forkedResponse)
	forkedRequests := int(math.Ceil(10 / requestSlice))
	forkedRequestResponses := make([]interface{}, forkedRequests)

	for i := 0; i < forkedRequests; i++ {
		go handler(requestsChan, i)
	}

	for i := 0; i < forkedRequests; i++ {
		select {
		case resp := <-requestsChan:
			forkedRequestResponses[resp.page] = resp.data
		}
	}

	var collectedResponses []interface{}

	for i := 0; i < forkedRequests; i++ {
		r := forkedRequestResponses[i]

		if reflect.TypeOf(r).Kind() == reflect.Slice {
			responses := reflect.ValueOf(r)
			length := responses.Len()

			if length > 0 {
				for j := 0; j < length; j++ {
					collectedResponses = append(collectedResponses, responses.Index(j).Interface())
				}
			}
		}
	}

	return collectedResponses
}
