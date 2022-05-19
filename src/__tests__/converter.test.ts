import { randomUUID } from 'crypto'
import { PercollateOptions } from 'percollate'
import { Converter } from '../converter'

describe('Converter', () => {

    test('Calls percollate with correct values', async () => {
        // given
        const converter = new Converter()
        const id = randomUUID()
        const urls = ['https://novelservice.github.io/']
        const stub = jest.fn()

        // when
        await converter.toEpub(id, urls, stub)

        // then
        let expectedOptions: PercollateOptions = {
            output: `${id}.epub`,
            wait: 2
        }
        expect(stub).toBeCalledWith(urls, expectedOptions)
    })

})
