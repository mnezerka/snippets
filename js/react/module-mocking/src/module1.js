console.log('module1, cache', require.cache[require.resolve('store')])

import Store from 'store'

export default class Module1 {
    touch() {
        console.log(Store)
        return Store.getData()
    }
}
