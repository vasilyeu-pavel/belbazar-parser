const { getAllParsedItemPath, readFileAsync, writeFile } = require('../src/utils/fileAPI')

const map = {
    colors: new Set(),
    collections: new Set(),
    kits: new Set(),
    fabrics: new Set(),
    styles: new Set(),
    season: new Set(),
}

const test = async () => {
    const allParsedItems = getAllParsedItemPath()
    for await (const { id } of allParsedItems) {
        // получаем json файл в папке с товаром
        const item = await readFileAsync(`${id}/${id}.json`)

        const getFieldValue = (name) => {
            const field = item[name]

            if (!field) return

            if (typeof field === "object") {
                Object
                    .values(field)
                    .filter(fieldValue => typeof fieldValue === "object")
                    .filter(fieldValue => !!fieldValue.value)
                    .map(fieldValue => fieldValue.value)
                    .forEach(value => {
                        value && typeof value === "string" && map[name].add(value.trim())
                    })
            }
        }

        Object.keys(map).forEach(fieldName => {
            getFieldValue(fieldName)
        })
    }

    const result = Object.keys(map).reduce((acc, name) => {
        acc[name] = [...map[name]]

        return acc
    }, {})

    await writeFile(result, "tmp.json")
}

test().catch()
