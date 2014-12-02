package routes

import (
	"net/http"

	"github.com/attamusc/be-janky/lib"
	"github.com/bndr/gojenkins"
	"github.com/gorilla/context"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
)

type templateData struct {
	Name   string
	Builds []gojenkins.Build
}

// Job - Build queue for the given job
func Job(rw http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	jobName := params["jobName"]

	jenkins := lib.GetJenkinsClient()
	buildIds := jenkins.GetAllBuildIds(jobName)

	var builds []gojenkins.Build

	for _, build := range buildIds {
		number := build.Number
		fullBuild := jenkins.GetBuild(jobName, number)
		builds = append(builds, *fullBuild)
	}

	render := context.Get(r, "render").(*render.Render)
	render.HTML(rw, 200, "job_list", templateData{Name: jobName, Builds: builds})
}
