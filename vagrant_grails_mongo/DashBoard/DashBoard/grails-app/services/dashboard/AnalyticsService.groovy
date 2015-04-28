package dashboard

import com.mongodb.Block
import com.mongodb.client.AggregateIterable
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.Projections
import grails.core.GrailsApplication
import grails.transaction.Transactional
import groovy.json.JsonSlurper
import org.bson.Document
import static java.util.Arrays.asList;

@Transactional
class AnalyticsService {

    GrailsApplication grailsApplication


    def COLLECTION_USER_SETTINGS = "userSettings"


    def db

    def loadDB() {
        if (!db) {
            db = DBConnectionFactory.getInstance(grailsApplication)
        }
        return db.loadDBConnection()
    }

    /**
     *
     * MongoDB query
     * Multiple unwinds as it's array of arrays
     * db.userSettings.aggregate([{$match:{app:"ME"}},{$unwind:"$services"},{$match:{"services.name":"RetreiveAccounts"}},{$unwind:"$services.properties"},{$group:{_id:"$services.properties.name",
     values:{ $addToSet: "$services.properties.value" }}}])
     */
    def retrieveStoredValuesForProperty(app, service, property = null) {
        MongoDatabase database = loadDB()
        MongoCollection<Document> settingsCollection = database.getCollection(COLLECTION_USER_SETTINGS)
        List<Document> pipeLine = new ArrayList<Document>()
        pipeLine.add(  new Document("\$match", new Document("app", app)))
        pipeLine.add(new Document("\$unwind", "\$services"))
        pipeLine.add( new Document("\$match", new Document("services.name", service)))
        pipeLine.add( new Document("\$unwind", "\$services.properties"))
        pipeLine.add(new Document("\$group", new Document("_id", "\$services.properties.name").append("values", new Document("\$addToSet", "\$services.properties.value"))))
        //filter by property name if exists
        if(property){
            pipeLine.add( new Document("\$match", new Document("\$_id", property)))
        }
        def cursor = settingsCollection.aggregate(pipeLine).iterator();

        def result=[:]
        def slurper=new JsonSlurper()
        while(cursor.hasNext()){
            def jsonDoc=slurper.parseText(cursor.next().toJson())
            result[jsonDoc._id]=jsonDoc.values;
        }
        return result;


    }

    def countOwnedTokens(owners){
        MongoDatabase database = loadDB()
        MongoCollection<Document> settingsCollection = database.getCollection(COLLECTION_USER_SETTINGS)
        def result=[:]
        owners.each{
            Document query = new Document("owner",it)
            def count=settingsCollection.find(query).size()
            result[it]=count
        }
        return result



    }
}
