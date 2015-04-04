package main

import (
	"net/http"
	"os"
	"strings"

	log "github.com/Sirupsen/logrus"
	"github.com/attamusc/be-janky/routes"
	"github.com/codegangsta/negroni"
	"github.com/gorilla/context"
	"github.com/meatballhat/negroni-logrus"
	"github.com/unrolled/render"
	"github.com/zenazn/goji/web"
)

func buildAPIMux() *web.Mux {
	api := web.New()

	api.Get("/api/jobs", routes.Jobs)
	api.Get("/api/jobs/:jobName", routes.Job)
	api.Get("/api/jobs/:jobName/:buildId", routes.Build)
	api.Get("/api/jobs/:jobName/:buildId/console", routes.ConsoleStream)

	return api
}

func attachMiddleware(m *http.ServeMux) *negroni.Negroni {
	n := negroni.New()
	re := render.New(render.Options{
		IndentJSON: true,
		Directory:  "templates",
		Extensions: []string{".html", ".tmpl"},
		Layout:     "application",
	})

	n.Use(negroni.NewRecovery())
	n.Use(negronilogrus.NewCustomMiddleware(log.InfoLevel, &log.TextFormatter{ForceColors: true}, "web"))
	n.Use(negroni.NewStatic(http.Dir("public")))

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
		if strings.HasSuffix(r.URL.Path, "/") {
			http.Redirect(rw, r, strings.TrimRight(r.URL.Path, "/"), 302)
		} else {
			http.ServeFile(rw, r, "./public/index.html")
		}
	})

	api := buildAPIMux()
	mux.Handle("/api/", api)

	n.Run(":" + port)
}
