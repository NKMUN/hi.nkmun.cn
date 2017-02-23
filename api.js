'use strict'

// API Mock server
const app = require('koa')()
const Router = require('koa-router')
const {sign} = require('jsonwebtoken')
const SECRET = 'secret'

const DATA_AC_TEST_ANSWER = [
    "公民意识：通过会议的讨论和国际、地区问题的解决培养学生们作为未来公民甚至决策者的一份责任。通过在国际和公共问题上发表观点并进行磋商，最后合力进行完善的处理，代表们在这一过程中便能逐渐培养出公民意识和社会、国际责任感。\r\n\r\n人文精神：每个会议的决策都应当以人文精神为准绳，不管是UNHRC，WHO，甚至GA，SC，在解决难民，卫生，城市发展，大规模杀伤性武器，网络安全，气候问题，经济社会，法律等各个层面的问题中，都包含了从生命权，健康权，自由权到追求幸福的权利等各项人文权利和精神，因为笔者认为联合国本身便建立在追求和平，平等，发展的人文主义精神之上。",
    "参加芝加哥模联MUNUC，北大模联PKUNMUN，复旦模联FDUIMUN，汇文模联NKMUN，南京校际模联，天津中学模联。社团为学生自主组织，包括社长，副社长，学术总监，宣传总监，会务总监等，共60余人。以校内会议，校内学术培训和交流，校外会议，校外学术活动和交流为主。"
]

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

global.get('/config/application', function*() {
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

global.get('/config/invitation', function*() {
    this.status = 200
    this.body = {
        account: 'notice@nkmun.cn',
        password: 'password',
        nickname: 'nick',
        template: '<html>Email template. {school}</html>',
        host: 'dm@aliyun.com',
        port: 465,
    }
})

global.put('/config/invitation', function*() {
    this.status = 200
    this.body = this.request.body
})

global.post('/config/invitation', function*() {
    // TODO: test invitation mail
    let {config, recepient} = this.request.body
    // TODO: send test email to recepient using config
    this.status = 200
    this.body = {}
})

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

global.post('/applications', function*() {
    if (this.request.body.school.name !== 'dup') {
        this.status = 200
        this.body = {}
    } else {
        this.status = 409
        this.body = { error: 'Duplicate application' }
    }
})

global.get('/applications', function*() {
    this.status = 200
    this.body = [
        { id: '1', name: '学校1', processed: true },
        { id: '2', name: '学校2' },
        { id: '3', name: '学校3' }
    ]
})

global.get('/applications/:id', function*() {
    let id = this.params.id
    this.status = 200
    this.body = {
        id,
        school: {
            name: '学校'+id,
            englishName: 'School '+id,
            address: ''+id+' School St, Somewhere, Earth'
        },
        contact: {
            name: '人名'+id,
            gender: 'm',
            phone: '13800000000',
            email: 'someone.'+id+'@example.com'
        },
        altContact: {
            name: '备用'+id,
            gender: 'f',
            phone: '13900000000',
            email: 'alternative.'+id+'example.com'
        },
        acTest: {
            '1': DATA_AC_TEST_ANSWER[0],
            '2': DATA_AC_TEST_ANSWER[1]
        },
        request: {
            'chinese':    3,
            'english':    4,
            'press':      2,
            'supervisor': 1,
            'observer':   2
        },
        seat: {
            '1': 1,
            '2': 2
        },
        processed: id === '1'
    }
})

global.patch('/applications/:id', function*() {
    this.status = 200
    this.body = {}
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
        { id: 'extra_leader', name: '领队', type: null, dual: false, reserved: true, price: 200 },
        { id: '1', name: '会场1', type: '中文', dual: false, price: 100, },
        { id: '2', name: '会场2', type: '英文', dual: true, price: 150 }
    ]
})

global.put('/sessions', function*() {
    this.status = 200
    this.body = [
        { id: 'extra_leader', name: '领队', type: null, dual: false, reserved: true, price: 200 },
        { id: '1', name: '会场1', type: '中文', dual: false, price: 100, },
        { id: '2', name: '修改会场', type: '英文', dual: true, price: 150 }
    ]
})

global.get('/hotels', function*() {
    this.status = 200
    this.body = [
        { id: 'h1_kng', name: '酒店1', type: '大床房', price: 500, stock: 10, available: 0 },
        { id: 'h1_std', name: '酒店1', type: '标准间', price: 500, stock: 10, available: 1 },
        { id: 'h2_kng', name: '酒店2', type: '大床房', price: 600, stock: 10, available: 3 },
        { id: 'h2_std', name: '酒店2', type: '标准间', price: 600, stock: 10, available: 5 },
    ]
})

global.post('/hotels', function*() {
    let rand = Math.floor( Math.random()*65536 )
    let { name, type, price, stock } = this.request.body
    this.status = 200
    this.body = {
        id: name,
        name,
        type,
        price,
        stock,
        available: stock
    }
})

global.get('/hotels/:id', function*() {
    let id = this.params.id
    this.status = 200
    this.body = {
        id: id,
        name: '酒店'+id,
        type: '标准间',
        stock: 10,
        available: 6
    }
})

global.patch('/hotels/:id', function*() {
    let id = this.params.id
    let { stock } = this.request.body
    this.status = 200
    this.body = {
        id,
        name: id,
        type: '修改房型',
        price: 999,
        stock: stock,
        available: 0
    }
})

global.delete('/hotels/:id', function*() {
    this.status = 200
    this.body = {
        count: 0
    }
})

global.get('/schools/:id', function*() {
    this.status = 200
    this.body = {
        id: 'school',
        name: '学校',
        englishName: 'English School Name',
        stage: '1.relinquishment'
    }
})

global.get('/schools/:id/messages', function*() {
    this.status = 200
    this.body = [
      { id: '1', title: 'Message', description: 'You did bad thing', type: 'payment', code: 'payment-fail' }
    ]
})

global.get('/schools/:id/seats', function*() {
    this.status = 200
    this.body = [
        { id: 'seat-1', school: 'school',
          session: { id: 's1', name: '会场1', dual: true }
        },
        { id: 'seat-2', school: 'school', exchangeWith: 'seat-x-1',
          session: { id: 's1', name: '会场1', dual: true }
        },
        { id: 'laeder-att', school: 'school',
          session: { id: 'leader', name: '领队', dual: false, reserved: true }
        },
    ]
})

global.delete('/schools/:id/seats/:seatId', function*() {
    this.status = 200
    this.body = {}
})

global.post('/schools/:id/seats/:seatId', function*() {
    this.status = 200
    this.body = {}
})

global.post('/schools/:id/seats/', function*() {
    if (this.query.confirm) {
        this.status = 200
        this.body = {}
    }else{
        // create new seat by admin
    }
})

app.use( require('koa-body')({ multipart: true }) )
app.use( require('koa-accesslog')() )
app.use( global.routes() )
app.listen(8002)
