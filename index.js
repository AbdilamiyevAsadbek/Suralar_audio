const surahSelect = document.querySelector("#surah__select")
const ayahSelect = document.querySelector("#ayah__select")
const audio = document.querySelector("audio")
const text = document.querySelector("#text")
const nameSelect= document.querySelector("#name__select")

const API_URL = 'https://api.alquran.cloud/v1'


;(async () => {
    const response = await fetch(`${API_URL}/edition/format/audio`)
    const {data} = await response.json()
    data?.forEach(name => {
        const option = document.createElement('option')
        option.value = name.identifier
        option.textContent = name.englishName
        nameSelect.appendChild(option)
    });
})()

nameSelect.addEventListener('change', (e) => {
    surahSelect.innerHTML = `<option selected disabled>Surani tanlang</option>`;
    (async() => {
        const response = await fetch(`${API_URL}/quran/${e.target.value}`)
        const {
            data: {surahs},
        } = await response.json()
        let selectedSurahIdx = 0
        surahs?.forEach((sura) => {
            const {number, englishName} = sura
            const option = document.createElement('option')
            option.value = number - 1
            option.textContent = `${number}.${englishName}`
            surahSelect.appendChild(option)
        })

        surahSelect.addEventListener('change', (e) => {
            const { value } = e.target
            selectedSurahIdx = value
            ayahSelect.innerHTML = `<option selected disabled>Oyatni Tanlang</option>`
            surahs[value]?.ayahs.forEach((_, idx) => {
                const option = document.createElement("option")
                option.value = idx
                option.textContent = `${idx + 1}`
                ayahSelect.appendChild(option)
            })
        })

        ayahSelect.addEventListener('change', (e) => {
            const {value} = e.target
            const selectedAyah = surahs[selectedSurahIdx]?.ayahs?.[value]
            audio.src = selectedAyah.audio
            text.textContent = selectedAyah.text
        })
    })()
})