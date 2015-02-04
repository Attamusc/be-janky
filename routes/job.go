package routes

import (
	"net/http"

	"github.com/attamusc/be-janky/lib"
	"github.com/gorilla/context"
	"github.com/unrolled/render"
	"github.com/zenazn/goji/web"
)

type desconstructedBuild struct {
	Number int64  `json:"number"`
	Status string `json:"status"`
}

// Job - Build queue for the given job
func Job(c web.C, rw http.ResponseWriter, r *http.Request) {
	jobName := c.URLParams["jobName"]

	jenkins := lib.GetJenkinsClient()
	builds, _ := jenkins.GetBuilds(jobName)

	render := context.Get(r, "render").(*render.Render)
	render.JSON(rw, 200, builds)
}
