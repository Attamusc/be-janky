package lib

import (
	"encoding/xml"
	"fmt"
	"io"
	"io/ioutil"
	"net/url"
	"os"
	"strings"

	log "github.com/Sirupsen/logrus"
	"github.com/franela/goreq"
)

// JenkinsClient - Wrapper for jenkins connection
type JenkinsClient struct {
	URL string
}

type jobsResponse struct {
	Wrapper string              `xml:"hudson"`
	Jobs    []jobPreviewElement `xml:"job"`
}

type buildsResponse struct {
	Wrapper string                `xml:"builds"`
	Builds  []buildPreviewElement `xml:"build"`
}

type jobPreviewElement struct {
	Name string `xml:"name" json:"name"`
}

type buildPreviewElement struct {
	Number   int    `xml:"number" json:"number"`
	Building bool   `xml:"building" json:"building"`
	Result   string `xml:"result" json:"result"`
	URL      string `xml:"url" json:"url"`
}

// GetJenkinsClient - Returns jenkins client using environment configured
// attributes
func GetJenkinsClient() *JenkinsClient {
	// Switch to using specific tree queries of the jenkins api, like:
	// http://localhost:8080/api/xml?tree=jobs[name,builds[number,building]]&xpath=//build[number[.=1]]&wrapper=builds
	jenkinsURL := os.Getenv("JENKINS_URL")
	if jenkinsURL == "" {
		jenkinsURL = "http://localhost:8080"
	}

	return &JenkinsClient{URL: jenkinsURL}
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

// GetJobs - return the configured jobs for this jenkins instance
func (j *JenkinsClient) GetJobs() ([]jobPreviewElement, error) {
	raw := j.get("api", map[string]string{
		"tree": "jobs[name]",
	})

	jobs := new(jobsResponse)
	if err := fromXMLTo(raw, jobs); err != nil {
		return nil, err
	}

	return jobs.Jobs, nil
}

// GetBuilds - http://localhost:8080/api/xml?tree=jobs[name,builds[number,building,result,url]]&xpath=//job[name[.=%22prod_build%22]]/build&wrapper=builds
func (j *JenkinsClient) GetBuilds(jobName string) ([]buildPreviewElement, error) {
	jobBuildsXpath := fmt.Sprintf("//job[name[.=\"%s\"]]/build", jobName)

	raw := j.get("api", map[string]string{
		"tree":    "jobs[name,builds[number,building,result,url]]",
		"xpath":   jobBuildsXpath,
		"wrapper": "builds",
	})

	builds := new(buildsResponse)
	if err := fromXMLTo(raw, builds); err != nil {
		log.Error(err)
		return nil, err
	}

	return builds.Builds, nil
}

func (j *JenkinsClient) GetBuild(jobName string, id int) interface{} {
	return nil
}

func (j *JenkinsClient) get(uri string, params map[string]string) *goreq.Body {
	res, _ := goreq.Request{
		Uri:         strings.Join([]string{j.URL, uri, "xml"}, "/"),
		QueryString: toQueryParams(params),
	}.Do()

	return res.Body
}

func toQueryParams(params map[string]string) url.Values {
	qsValues := url.Values{}

	for key, value := range params {
		qsValues.Set(key, value)
	}

	return qsValues
}
