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
	jobs := jenkins.GetAllJobs()

	re := context.Get(r, "render").(*render.Render)
	re.HTML(rw, 200, "jobs_list", jobs)
}
