
import { parse } from '../node_modules/papaparse/papaparse.js'

const $file = document.getElementById('file')

const rows = [['First','Last','Email','Title','Company']]
const queries = []
const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const lookupLinkedInLinks = () => {
    return Promise.all(queries.map(async (q) => {
        const response = await fetch('.netlify/functions/upload', {
            method: 'POST',
            body: JSON.stringify(`${q.name} ${q.company}`)
        })

        const data = await response.json()

        rows.push([q.name, q.company, data.url, data.title])
    }))
}


$file.addEventListener('change', (e) => {
    console.log('uploading...')
    console.log(e.target.files)
    parse(e.target.files[0], {
        step: async (results, parser) => {
            if (results.data[0].toLowerCase() === 'first name') return

            queries.push({name: `${results.data[0]} ${results.data[1]}`, company: results.data[4]})
        },
        error: (error) => console.log(error),
        complete: async () => {
            await lookupLinkedInLinks()

            let csvContent = 'data:text/csv;charset=utf-8,' + rows.reverse().map(x => x.join(',')).join('\n')
            window.open(encodeURI(csvContent))
        }
    })
})

   
