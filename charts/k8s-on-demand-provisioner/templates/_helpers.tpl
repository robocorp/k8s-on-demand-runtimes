{{/* vim: set filetype=mustache: */}}

{{- define "gen.secret" -}}
{{- $secret := lookup "v1" "Secret" .Release.Namespace "api-secret" -}}
{{- if $secret -}}
{{/*
   Reusing existing secret data
*/}}
secret: {{ $secret.data.secret }}
{{- else -}}
{{/*
    Generate new data
*/}}
secret: {{ randAlphaNum 32 | b64enc }}
{{- end -}}
{{- end -}}

