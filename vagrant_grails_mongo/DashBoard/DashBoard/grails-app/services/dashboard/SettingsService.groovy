package dashboard

import com.mongodb.BasicDBObject
import com.mongodb.DBObject
import com.mongodb.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.FindOneAndReplaceOptions
import com.mongodb.client.model.Projections
import com.mongodb.util.JSON
import grails.core.GrailsApplication
import grails.transaction.Transactional
import groovy.json.JsonSlurper
import org.bson.Document

/**
 * {
 "env": "",
 "app": "",
 "userID": "",
 "services": [
 {
 "name": "",
 "properties": [
 {
 "name": "",
 "value": ""
 }
 ]
 }
 ]
 }

 //setup envs
 DBConnectionFactory.envs.insert({name:"DEV"})
 DBConnectionFactory.envs.insert({name:"ST"})
 DBConnectionFactory.envs.insert({name:"PT"})
 DBConnectionFactory.envs.insert({name:"RT"})

 //setup apps
 DBConnectionFactory.envs.insert({name:"dashboard.templates.ME"})
 DBConnectionFactory.envs.insert({name:"CIL"})


 //insert
 DBConnectionFactory.userSettings.insert({env:"DEV",app:"dashboard.templates.ME",userID:"test",services:[{"name":"BAM","properties":[{"name":"REGION","value":"CICSAA"}]}]})

 //load useres belongs to env and app
 DBConnectionFactory.userSettings.find({env:"DEV",app:"dashboard.templates.ME"})

 //load certain service settings
 DBConnectionFactory.userSettings.find({userID:"test","services.name":"BAM"})

 //group by env
 DBConnectionFactory.userSettings.aggregate(
 [
 {
 $group:
 {
 _id: { name: "$env"},
 count: { $sum: 1 }
 }
 }
 ]
 )

 DBConnectionFactory.userSettings.aggregate(
 [
 {
 $group:
 {
 _id: { name: "$app"},
 count: { $sum: 1 }
 }
 }
 ]
 )
 */

@Transactional
class SettingsService {
    GrailsApplication grailsApplication

    def COLLECTION_ENVS="envs"
    def COLLECTION_APPS="apps"
    def COLLECTION_USER_SETTINGSS="userSettings"


    def db

    def loadDB(){
        if(!db){
            db=DBConnectionFactory.getInstance(grailsApplication)
        }
        return db.loadDBConnection()
    }

    def loadEnvs(){
        MongoDatabase database=loadDB()
        MongoCollection<Document> envsCollection=database.getCollection(COLLECTION_ENVS)
        def cursor= envsCollection.find().projection(Projections.excludeId()).iterator()
        def result=[]
        def slurper=new JsonSlurper()
        while(cursor.hasNext()){
            def item=slurper.parseText(cursor.next().toJson())
            result<<item
        }
        return result
    }
    def addEnvironment( name ){
        MongoDatabase database=loadDB()
        MongoCollection<Document> envsCollection=database.getCollection(COLLECTION_ENVS)
        //DBConnectionFactory.envs.insert({name:"DEV"})
        Document doc = new Document("name", name)
        envsCollection.findOneAndReplace(doc,doc, new FindOneAndReplaceOptions(upsert: true))

    }
    def removeEnvironment(name){
        MongoDatabase database=loadDB()
        MongoCollection<Document> envsCollection=database.getCollection(COLLECTION_ENVS)
        BasicDBObject query = new BasicDBObject("name",name)
        envsCollection.deleteOne(query);

        //delete all related settings records
        BasicDBObject relatedSettings = new BasicDBObject("env",name)
        MongoCollection<Document> settingsCollection=database.getCollection(COLLECTION_USER_SETTINGSS)
        settingsCollection.deleteMany(relatedSettings)
    }
    def addApp( appName,app){
        MongoDatabase database=loadDB()
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_APPS)
        Document doc = new Document("name", appName)
        def appStr=app as grails.converters.JSON
        def item = Document.parse(appStr.toString())
        appsCollection.findOneAndReplace(doc,item, new FindOneAndReplaceOptions(upsert: true))
    }
    def removeApp(name){
        MongoDatabase database=loadDB()
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_APPS)
        BasicDBObject query = new BasicDBObject("name",name)
        appsCollection.deleteOne(query);

        //delete all related settings records
        BasicDBObject relatedSettings = new BasicDBObject("app",name)
        MongoCollection<Document> settingsCollection=database.getCollection(COLLECTION_USER_SETTINGSS)
        settingsCollection.deleteMany(relatedSettings)
    }
    def loadApps(){
        MongoDatabase database=loadDB()
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_APPS)

        def cursor = appsCollection.find().projection(Projections.excludeId()).iterator()
        def result=[]
        def slurper=new JsonSlurper()
        while(cursor.hasNext()){
            def item=slurper.parseText(cursor.next().toJson())
            result<<item
        }
        return result
    }
    def retrieveAppTemplate(appName){
        MongoDatabase database=loadDB()
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_APPS)
        Document query = new Document("name",appName)
        def cursor=appsCollection.find(query).projection(Projections.excludeId()).iterator()
        def template=(cursor.hasNext())?cursor.next():null
        if(template){
            def slurper=new JsonSlurper()
            template=slurper.parseText(template.toJson())
            template=template.services
        }
        return template

    }
    def generateTokenSettingsForApp(env,app,token,owner){
        MongoDatabase database=loadDB()
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_APPS)
        BasicDBObject query = new BasicDBObject("name",app)
        Document appDB=appsCollection.find(query).projection(Projections.excludeId())?.first()
        def slurper=new JsonSlurper()
        def setting=slurper.parseText(appDB.toJson())
        def result=slurper.parseText("{}")
        result.env=env
        result.app=app
        result.token=token
        result.owner=owner
        result.services=setting.services
        return result
    }

    def loadTokens(def env,def app){
        MongoDatabase database=loadDB()
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_USER_SETTINGSS)
        BasicDBObject query = new BasicDBObject("env",env)
        query.append("app",app)

        def cursor = appsCollection.find(query).projection(Projections.excludeId()).sort {token:1}.iterator()
        def result=[]
        def slurper=new JsonSlurper()
        while(cursor.hasNext()){
            def item=slurper.parseText(cursor.next().toJson())
            result<<item
        }
        return result
    }


    def loadTokenSettings(env,app,token,service=null) {
        MongoDatabase database=loadDB()
        MongoCollection stgCollection=database.getCollection(COLLECTION_USER_SETTINGSS)
        BasicDBObject query = new BasicDBObject("env",env)
        query.append("app",app)
        query.append("token",token)
        def cursor = stgCollection.find(query).projection(Projections.excludeId()).iterator()
        def item = cursor.hasNext() ? cursor.next() : null;
        if(item){
            def slurper=new JsonSlurper()
            item=slurper.parseText(item.toJson())

            if(service){
                def result=null
                item.services.each{
                    if(it.name==service){
                        result=it
                        return
                    }
                }
                return result

            }
        }
        return item

    }
    def upsertTokenSettings(setting){
        MongoDatabase database=loadDB()
        def appsCollection=database.getCollection(COLLECTION_USER_SETTINGSS)


        def criteria=new Document("env",setting.env)
        criteria.append("app",setting.app)
        criteria.append("token",setting.token)

        def stgStr=setting as grails.converters.JSON
        def item = Document.parse(stgStr.toString())
        appsCollection.findOneAndReplace(criteria,item, new FindOneAndReplaceOptions(upsert: true))
    }
    def removeTokenSettings(env,app,token){
        MongoDatabase database=loadDB()
        MongoCollection stgCollection=database.getCollection(COLLECTION_USER_SETTINGSS)
        BasicDBObject query = new BasicDBObject("env",env)
        query.append("app",app)
        query.append("token",token)
        stgCollection.deleteOne(query);
    }
}
