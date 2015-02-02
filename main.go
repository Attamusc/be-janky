package main

import (
	"net/http"
	"os"

	"github.com/attamusc/be-janky/routes"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/context"
	"github.com/unrolled/render"
	"github.com/zenazn/goji/web"
)

func buildAPIMux() *web.Mux {
	api := web.New()

	api.Get("/api/recent", routes.Index)
	api.Get("/api/jobs", routes.Jobs)
	api.Get("/api/jobs/:jobName", routes.Job)
	api.Get("/api/jobs/:jobName/:buildId", routes.Build)

	return api
}

func attachMiddleware(m *http.ServeMux) *negroni.Negroni {
	n := negroni.Classic()
	re := render.New(render.Options{
		IndentJSON: true,
		Directory:  "templates",
		Extensions: []string{".html", ".tmpl"},
		Layout:     "application",
	})

	n.Use(negroni.HandlerFunc(func(rw http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
		context.Set(r, "render", re)
		next(rw, r)
	}))

	n.UseHandler(m)

	return n
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	mux := http.NewServeMux()
	n := attachMiddleware(mux)

	mux.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("./public"))))
	mux.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		http.ServeFile(rw, r, "./public/index.html")
	})

	api := buildAPIMux()
	mux.Handle("/api/", api)

	n.Run(":" + port)
}
