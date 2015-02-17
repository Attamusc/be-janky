package routes

import (
	"net/http"

	"github.com/attamusc/be-janky/lib"
	"github.com/gorilla/context"
	"github.com/unrolled/render"
)

type taskTemplateData struct {
	JobName string
}

// Index - List the current build queue
func Index(rw http.ResponseWriter, r *http.Request) {
	jenkins := lib.GetJenkinsClient()
	jobs, _ := jenkins.GetRecentBuilds()

	render := context.Get(r, "render").(*render.Render)
	render.JSON(rw, 200, jobs)
}
