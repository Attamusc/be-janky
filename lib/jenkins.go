package lib

import (
	"encoding/xml"
	"io"
	"io/ioutil"
	"net/url"
	"os"
	"strings"

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

type jobPreviewElement struct {
	Name string `xml:"name" json:"name"`
}

type buildPreviewElement struct {
	Number int
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

func fromResponseToXML(raw io.Reader, out interface{}) error {
	if body, err := ioutil.ReadAll(raw); err != nil {
		return err
	} else if err := xml.Unmarshal(body, out); err != nil {
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
	if err := fromResponseToXML(raw, jobs); err != nil {
		return nil, err
	}

	return jobs.Jobs, nil
}

func (j *JenkinsClient) GetBuild(name string, id int) interface{} {
	return nil
}

func (j *JenkinsClient) GetAllBuildIds(jobName string) []interface{} {
	return []interface{}{}
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
