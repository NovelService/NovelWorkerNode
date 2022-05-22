import exp from 'constants'
import { randomUUID } from 'crypto'
import path from 'path'
import { PercollateOptions } from 'percollate'
import { Converter } from '../converter'

describe('Converter', () => {

    let a = 1
    test('Calls percollate with correct values', async () => {
        // given
        const converter = new Converter()
        const id = randomUUID()
        const urls = ['https://novelservice.github.io/']
        const stub = jest.fn()

        // when
        const {filepath, filename} = await converter.toEpub(id, urls, stub)

        // then
        let expectedOptions: PercollateOptions = {
            output: path.join(filepath, filename),
            wait: 2
        }
        expect(stub).toBeCalledWith(urls, expectedOptions)
    })

})
