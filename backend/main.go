package main

import (
	"fmt"
	"log"

	"github.com/muhfaiizr/dagangcommerce/backend/bootstrap"
)

func main() {
	// Initialize and Boot all application services (similar to Laravel booting)
	app := bootstrap.Boot()

	port := app.Config.App.Port
	log.Printf("Starting %s on %s environment...", app.Config.App.Name, app.Config.App.Env)
	log.Printf("API documentation and endpoints are ready at http://localhost:%s", port)

	// Start the server
	err := app.Engine.Run(fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatalf("Error running the server: %v", err)
	}
}
