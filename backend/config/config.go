package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	App AppConfig
	DB  DBConfig
	JWT JWTConfig
}

type AppConfig struct {
	Name  string
	Env   string
	Key   string
	Debug bool
	URL   string
	Port  string
}

type DBConfig struct {
	Connection string
	Host       string
	Port       string
	Database   string
	Username   string
	Password   string
	SSLMode    string
}

type JWTConfig struct {
	Secret      string
	ExpireHours int
}

var GlobalConfig *Config

// Load loads the configuration from .env or system environment
func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, loading from system environment instead")
	}

	debug, _ := strconv.ParseBool(getEnv("APP_DEBUG", "true"))
	jwtExpire, _ := strconv.Atoi(getEnv("JWT_EXPIRE_HOURS", "72"))

	GlobalConfig = &Config{
		App: AppConfig{
			Name:  getEnv("APP_NAME", "DagangCommerce"),
			Env:   getEnv("APP_ENV", "local"),
			Key:   getEnv("APP_KEY", ""),
			Debug: debug,
			URL:   getEnv("APP_URL", "http://localhost:8000"),
			Port:  getEnv("APP_PORT", "8000"),
		},
		DB: DBConfig{
			Connection: getEnv("DB_CONNECTION", "postgres"),
			Host:       getEnv("DB_HOST", "127.0.0.1"),
			Port:       getEnv("DB_PORT", "5432"),
			Database:   getEnv("DB_DATABASE", "dagangcoomerce"),
			Username:   getEnv("DB_USERNAME", "muhfaiizr"),
			Password:   getEnv("DB_PASSWORD", "admin"),
			SSLMode:    getEnv("DB_SSLMODE", "disable"),
		},
		JWT: JWTConfig{
			Secret:      getEnv("JWT_SECRET", "default_secret_key_change_me"),
			ExpireHours: jwtExpire,
		},
	}

	return GlobalConfig
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
