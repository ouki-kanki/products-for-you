document.addEventListener('DOMContentLoaded', () => {
    const lengthField = document.getElementById('id_length')
    const heightField = document.getElementById('id_height')
    const widthField = document.getElementById('id_width')
    const volumeField = document.getElementById('id_volume')
    const volumeFieldInMeters = document.getElementById('id_volume_meters')

    const calculateVolume = () => {
        const length = parseFloat(lengthField.value || 0)
        const height = parseFloat(heightField.value || 0)
        const width = parseFloat(widthField.value || 0)

        if (length > 0 && height > 0 && width > 0) {
            const volume = (length * height * width)
            const volume_in_meters = volume / 1000000
            volumeField.value = volume.toFixed(3)
            volumeFieldInMeters.value = volume_in_meters.toFixed(3)
        } else {
            volumeField.value = 0
            volumeFieldInMeters.value = 0
        }
    }

    [lengthField, heightField, widthField].forEach(field => {
        field.addEventListener('input', calculateVolume)
    })
    window.addEventListener('beforeunload', () => {
        [lengthField, heightField, widthField].forEach(field => {
            field.removeEventListener('input', calculateVolume)
        })
    })
})
