package routes

import (
	"net/http"
	"strconv"

	"github.com/attamusc/be-janky/lib"
	"github.com/gorilla/context"
	"github.com/unrolled/render"
	"github.com/zenazn/goji/web"
)

// Build - Details about the given build
func Build(c web.C, rw http.ResponseWriter, r *http.Request) {
	jobName := c.URLParams["jobName"]
	number, _ := strconv.Atoi(c.URLParams["buildId"])

	jenkins := lib.GetJenkinsClient()
	build := jenkins.GetBuild(jobName, number)

	render := context.Get(r, "render").(*render.Render)
	render.HTML(rw, 200, "build_details", build)
}
