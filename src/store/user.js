import Base64 from 'base64-js'

function Utf8ArrayToStr(array) {
  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while(i < len) {
  c = array[i++];
  switch(c >> 4)
  {
    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
      // 0xxxxxxx
      out += String.fromCharCode(c);
      break;
    case 12: case 13:
      // 110x xxxx   10xx xxxx
      char2 = array[i++];
      out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
      break;
    case 14:
      // 1110 xxxx  10xx xxxx  10xx xxxx
      char2 = array[i++];
      char3 = array[i++];
      out += String.fromCharCode(((c & 0x0F) << 12) |
                     ((char2 & 0x3F) << 6) |
                     ((char3 & 0x3F) << 0));
      break;
  }
  }

  return out;
}

function jwtBody(token) {
  try {
    return JSON.parse( Utf8ArrayToStr( Base64.toByteArray( token.split('.')[1] ) ) )
  }catch(e){
    return null
  }
}

export default {
  namespaced: true,
  state: {
    token: null,
    payload: {}
  },
  getters: {
    role:   state => {
      const precedance = ['root', 'admin', 'school']
      const access = state.payload.access || []
      return precedance.find( $ => access.indexOf($) !== -1 )
    },
    school: state => state.payload.school,
    authorization: state => [ 'Authorization', 'Bearer '+state.token ]
  },
  mutations: {
    token( state, token ) {
      if (token) {
        state.token = token
        state.payload = jwtBody(token)
      }else {
        state.token = null
        state.payload = {}
      }
    }
  }
}
