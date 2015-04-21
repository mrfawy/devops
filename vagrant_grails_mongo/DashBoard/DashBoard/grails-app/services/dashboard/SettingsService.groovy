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
    def mongoClient
    def database

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
    }
    def addApp( name ){
        MongoDatabase database=loadDB()
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_APPS)
        //DBConnectionFactory.apps.insert({name:"DEV"})
        Document doc = new Document("name", name)
        appsCollection.findOneAndReplace(doc,doc, new FindOneAndReplaceOptions(upsert: true))
    }
    def removeApp(name){
        MongoDatabase database=loadDB()
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_APPS)
        BasicDBObject query = new BasicDBObject("name",name)
        appsCollection.deleteOne(query);
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

    def loadUsers(def env,def app){
        MongoDatabase database=loadDB()
        MongoCollection<Document> appsCollection=database.getCollection(COLLECTION_USER_SETTINGSS)
        BasicDBObject query = new BasicDBObject("env",env)
        query.append("app",app)

        def cursor = appsCollection.find(query).projection(Projections.excludeId()).iterator()
        def result=[]
        def slurper=new JsonSlurper()
        while(cursor.hasNext()){
            def item=slurper.parseText(cursor.next().toJson())
            result<<item
        }
        return result
    }


    def loadUserSettings(env,app,userId) {
        MongoDatabase database=loadDB()
        MongoCollection stgCollection=database.getCollection(COLLECTION_USER_SETTINGSS)
        BasicDBObject query = new BasicDBObject("env",env)
        query.append("app",app)
        query.append("userId",userId)



        def cursor = stgCollection.find(query).projection(Projections.excludeId()).iterator()
        def item = cursor.hasNext() ? cursor.next() : null;
        return item

    }
    def upsertUserSettings(setting){
        MongoDatabase database=loadDB()
        def appsCollection=database.getCollection(COLLECTION_USER_SETTINGSS)


        def criteria=new Document("env",setting.env)
        criteria.append("app",setting.app)
        criteria.append("userId",setting.userId)

        def stgStr=setting as grails.converters.JSON
        def item = Document.parse(stgStr.toString())
        appsCollection.findOneAndReplace(criteria,item, new FindOneAndReplaceOptions(upsert: true))
    }
    def removeUserSettings(env,app,userId){
        MongoDatabase database=loadDB()
        MongoCollection stgCollection=database.getCollection(COLLECTION_USER_SETTINGSS)
        BasicDBObject query = new BasicDBObject("env",env)
        query.append("app",app)
        query.append("userId",userId)
        stgCollection.deleteOne(query);
    }
}
