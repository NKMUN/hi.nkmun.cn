'use strict'

// API Mock server
const app = require('koa')()
const Router = require('koa-router')
const {sign} = require('jsonwebtoken')
const SECRET = 'secret'

// API mock
let global = new Router()

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

app.use( require('koa-body')({ multipart: true }) )
app.use( require('koa-accesslog')() )
app.use( global.routes() )
app.listen(8002)
