package dashboard.templates

import com.google.gson.JsonObject
import groovy.json.JsonSlurper

class ME {
    def app="ME"

    def init(env, token) {
        def template = """
{
  "env": "$env",
  "app": "$app",
  "token": "$token",
  "services": [
    {
      "name": "BAM",
      "properties": [
        {
          "name": "REGION",
          "value": "CICXX"
        }
      ]
    }
  ]
}
"""
        def slurper = new JsonSlurper();
        slurper.parseText(template)

    }


}

