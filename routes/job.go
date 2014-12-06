package routes

import (
	"net/http"

	"github.com/attamusc/be-janky/lib"
	"github.com/bndr/gojenkins"
	"github.com/gorilla/context"
	"github.com/unrolled/render"
	"github.com/zenazn/goji/web"
)

type jobTemplateData struct {
	Name   string
	Builds []gojenkins.Build
}

// Job - Build queue for the given job
func Job(c web.C, rw http.ResponseWriter, r *http.Request) {
	jobName := c.URLParams["jobName"]

	jenkins := lib.GetJenkinsClient()
	buildIds := jenkins.GetAllBuildIds(jobName)

	builds := make([]gojenkins.Build, len(buildIds))
	for i, build := range buildIds {
		number := build.Number
		builds[i] = *jenkins.GetBuild(jobName, number)
	}

	render := context.Get(r, "render").(*render.Render)
	tmplData := jobTemplateData{
		Name:   jobName,
		Builds: builds,
	}

	render.HTML(rw, 200, "job_list", tmplData)
}
