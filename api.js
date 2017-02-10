'use strict'

// API Mock server
const app = require('koa')()
const Router = require('koa-router')
const {sign} = require('jsonwebtoken')
const SECRET = 'secret'

// API mock
let global = new Router()

global.post('/initialize', function*() {
    yield new Promise( r => setTimeout(r, 5000) )
    this.status = 200
    this.body = {}
})

global.get('/config', function*() {
    this.status = 200
    this.body = {
        apply: true,
        register: true,
        login: true
    }
} )

global.post('/login', function*() {
    const { user } = this.request.body
    if ( ['root', 'admin', 'school'].find( $ => $ === user ) ) {
        this.status = 200
        this.body = {
            token: sign({
                role: user,
                school: user==='school' ? 'school' : null
            }, SECRET, { expiresIn: '7 days' })
        }
    } else {
        this.status = 403
        this.body = { error: 'Wrong credential' }
    }
} )

global.get('/application', function*() {
    // application config
    this.status = 200
    this.body = {
        apply: true,  // flag: whether applications are allowed
        press: true,  // show MPC input
        disclaimer: '<p>特别声明html</p>',    // disclaimer
        tests: [
            { id: '1', question: 'question 1' },
            { id: '2', question: 'question 2' }
        ]
    }
})

global.post('/application', function*() {
    if (this.request.body.school.name !== 'dup') {
        this.status = 200
        this.body = {}
    } else {
        this.status = 409
        this.body = { error: 'Duplicate application' }
    }
})

global.get('/service-agreement', function*() {
    this.status = 200
    this.body = {
        html: '<p>服务条款html</p>'
    }
})

global.get('/invitation/:code', function*() {
    if (this.params.code !== 'error') {
        this.status = 200
        this.body = {
            school: {
                name: '学校名',
                englishName: 'School Name'
            },
            token: sign({ school: '学校名' }, SECRET, { expiresIn: '1 hour' })
        }
    } else {
        this.status = 404
        this.body = {
            error: 'No such invitation'
        }
    }
})

global.post('/registration', function*() {
    let name = this.request.body.leader.name
    switch(name) {
        case '409': this.status = 409; this.body = { error: 'Already registered' }; break
        case '410': this.status = 410; this.body = { error: 'Token expired' }; break
        case '403': this.status = 403; this.body = { error: 'Forbidden' }; break
        default:    this.status = 200; this.body = { schoolId: 'school-id' }; break
    }
})

global.get('/sessions', function*() {
    this.status = 200
    this.body = [
        { id: '1', name: '会场1', type: '中文', dual: false },
        { id: '2', name: '会场2', type: '英文', dual: true }
    ]
})

global.put('/sessions', function*() {
    this.status = 200
    this.body = {}
})

app.use( require('koa-body')({ multipart: true }) )
app.use( require('koa-accesslog')() )
app.use( global.routes() )
app.listen(8002)
