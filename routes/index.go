package routes

import (
	"net/http"

	"github.com/gorilla/context"
	"github.com/unrolled/render"
)

type taskTemplateData struct {
	JobName string
}

// Index - List the current build queue
func Index(rw http.ResponseWriter, r *http.Request) {
	//jenkins := lib.GetJenkinsClient()
	//jobs := jenkins.GetAllJobNames()

	tasks := make([]taskTemplateData, 0)

	//for i, task := range queue {
	//tasks[i] = taskTemplateData{JobName: task.GetJob().GetName()}
	//}

	render := context.Get(r, "render").(*render.Render)
	render.HTML(rw, 200, "index", tasks)
}
