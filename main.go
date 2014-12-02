package main

import (
	"net/http"
	"os"

	"github.com/attamusc/be-janky/routes"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/context"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
)

func buildMux() *mux.Router {
	m := mux.NewRouter().StrictSlash(false)

	m.HandleFunc("/", nil).Methods("GET")
	m.HandleFunc("/jobs", routes.Jobs).Methods("GET")
	m.HandleFunc("/jobs/{jobName}", routes.Job).Methods("GET")
	m.HandleFunc("/jobs/{jobName}/{buildId}", nil).Methods("GET")

	return m
}

func buildMiddleware(m *mux.Router) *negroni.Negroni {
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

	m := buildMux()
	n := buildMiddleware(m)

	n.Run(":" + port)
}
