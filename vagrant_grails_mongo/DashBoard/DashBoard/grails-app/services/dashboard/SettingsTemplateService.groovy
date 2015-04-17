package dashboard

import grails.transaction.Transactional

@Transactional
class SettingsTemplateService {

    def pkg="dashboard.templates."

    def createTemplateForApp(env,app,userId) {
        def template = this.class.classLoader.loadClass(pkg+app)?.newInstance()
        template.init(env,userId)
    }

}
