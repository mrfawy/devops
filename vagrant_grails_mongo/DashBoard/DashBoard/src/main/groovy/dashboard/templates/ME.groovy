package dashboard.templates

import com.google.gson.JsonObject
import groovy.json.JsonSlurper

class ME {
    def app="ME"

    def init(env, userId) {
        def template = """
{
  "env": "$env",
  "app": "$app",
  "userId": "$userId",
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

