package routes

import (
	"net/http"

	log "github.com/Sirupsen/logrus"
	"github.com/attamusc/be-janky/lib"
	"github.com/gorilla/context"
	"github.com/unrolled/render"
)

// Jobs - Listing of all configured jobs
func Jobs(rw http.ResponseWriter, r *http.Request) {
	jenkins := lib.GetJenkinsClient()

	if jobs, err := jenkins.GetJobs(); err != nil {
		log.Error(err)
	} else {
		render := context.Get(r, "render").(*render.Render)
		render.JSON(rw, 200, jobs)
	}
}
