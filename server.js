var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
// GraphQL schema
var schema = buildSchema(`
    type Query {
        message: String
    }
`);

//data
const { courses } = require('./data.json');
console.log(courses);
const schema = buildSchema(`
    type Query {
        course(id:Int!):Course
        courses:(topic:String):[Course]
    }
    type Course {
        id:Int
        title: String
        description: String
        author: String
        topic: String
        url: String
    }
    `);
let getCourse = (args) => {
    let id = args.id;
    return courses.filter(course => {
        return course.id ==id;
    })
}
let getCourses = (args) => {
    if(args.topic){
        let topic = args.topic;
        return courses.filter(course =>course.topic === topic);
    }else{
        return courses;
    }
};
let updateCourseTopic = ({id, topic})=> {
    courses.map(course => {
        if(course.id === id){
            course.topic = topic;
            return course;
        }
    })
    return courses.filter(course => course.id === id)[0];
}
// Root resolver
var root = {
    course: getCourse
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
