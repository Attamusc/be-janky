package lib

import (
	"os"

	"github.com/bndr/gojenkins"
)

// GetJenkinsClient - Returns jenkins client using environment configured
// attributes
func GetJenkinsClient() *gojenkins.Jenkins {
	jenkinsURL := os.Getenv("JENKINS_URL")
	if jenkinsURL == "" {
		jenkinsURL = "http://localhost:8080/"
	}

	jenkins := gojenkins.CreateJenkins(jenkinsURL, "", "").Init()
	return jenkins
}

// GetMostRecentBuilds - Return a slice of
