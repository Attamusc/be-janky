package routes

import (
	"net/http"

	"github.com/attamusc/be-janky/lib"
	"github.com/gorilla/context"
	"github.com/unrolled/render"
)

// Jobs - Listing of all configured jobs
func Jobs(rw http.ResponseWriter, r *http.Request) {
	jenkins := lib.GetJenkinsClient()
	jobs, _ := jenkins.GetJobs()

	render := context.Get(r, "render").(*render.Render)
	render.JSON(rw, 200, jobs)
}
