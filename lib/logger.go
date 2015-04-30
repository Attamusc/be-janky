package lib

import "github.com/Sirupsen/logrus"

// NewLogger - Create new logrus logger instance
func NewLogger() *logrus.Logger {
	l := logrus.New()
	l.Level = logrus.InfoLevel
	l.Formatter = &logrus.TextFormatter{ForceColors: true}

	return l
}
