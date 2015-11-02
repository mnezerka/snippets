import Store from 'store'

class MockStore {
    getData() {
        return 'MockedData'
    }
}
require.cache[require.resolve('store')].exports = new MockStore()
console.log(require.cache[require.resolve('store')].exports)
//console.log(require.cache[require.resolve('module1')].exports)
//console.log(require.cache[require.resolve('module1')].exports)

import Module1 from 'module1'

//console.log(require.cache[require.resolve('axios')].exports = mockAxios;)
//console.log(require.cache)
//console.log(require.cache[require.resolve('module1')])

//console.log(require.cache[require.resolve('module1')].exports)
//require.cache[require.resolve('module1')].exports = MockModule1
//console.log(require.cache[require.resolve('module1')].exports)

var m1 = new Module1

console.log('Touched is:', m1.touch())
