package routes

import (
	"net/http"
	"strconv"

	"github.com/attamusc/be-janky/lib"
	"github.com/gorilla/context"
	"github.com/unrolled/render"
	"github.com/zenazn/goji/web"
)

// ConsoleStream - Progressive console output of the given build
func ConsoleStream(c web.C, rw http.ResponseWriter, r *http.Request) {
	jobName := c.URLParams["jobName"]
	number, _ := strconv.Atoi(c.URLParams["buildId"])
	offset := r.URL.Query().Get("start")

	jenkins := lib.GetJenkinsClient()
	consoleOutput := jenkins.GetProgressiveConsoleOutput(jobName, number, offset)

	render := context.Get(r, "render").(*render.Render)
	render.JSON(rw, 200, consoleOutput)
}
