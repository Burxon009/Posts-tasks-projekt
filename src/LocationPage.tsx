import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button, Typography, IconButton, Snackbar } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'

const position: any = [41.3420557, 69.3366532]

const icon = L.divIcon({
    html: '<div style="font-size:36px;line-height:40px">🏢</div>',
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
})

const myIcon = L.divIcon({
    html: '<div style="font-size:36px;line-height:40px">📍</div>',
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
})

function LocationPage(){
    const navigate = useNavigate()
    const { t } = useTranslation()
    const mapRef = useRef<any>(null)
    const [myPosition, setMyPosition] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleMyLocation = () => {
        if (!navigator.geolocation) {
            setError(t('location.errorUnknown'))
            return
        }
        setLoading(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = [pos.coords.latitude, pos.coords.longitude]
                setMyPosition(coords)
                mapRef.current.flyTo(coords, 16)
                setLoading(false)
            },
            (err) => {
                setError(err.code === 1 ? t('location.errorDenied') : t('location.errorUnknown'))
                setLoading(false)
            }
        )
    }

    return(
        <div style={{ margin: '20px' }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>{t('common.back')}</Button>
            <Typography variant="h4">{t('location.title')}</Typography>
            <div style={{ position: 'relative' }}>
                <MapContainer ref={mapRef} center={position} zoom={17} style={{height: "80vh", width: "100%"}}>
                    <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                    <Marker position={position} icon={icon}>
                        <Popup>
                            <b>Uzinfocom</b><br />
                            {t('location.addressLabel')}: {t('location.address')}<br />
                            {t('location.siteLabel')}: <a href="https://uzinfocom.uz" target="_blank">uzinfocom.uz</a><br />
                            {t('location.phoneLabel')}: <a href="tel:+998712022202">+998 71 202-22-02</a>
                        </Popup>
                    </Marker>
                    {myPosition && (
                        <Marker position={myPosition} icon={myIcon}>
                            <Popup>{t('location.youAreHere')}</Popup>
                        </Marker>
                    )}
                </MapContainer>
                <IconButton
                    aria-label={t('location.myLocation')}
                    title={t('location.myLocation')}
                    onClick={handleMyLocation}
                    disabled={loading}
                    style={{ position: 'absolute', right: '20px', bottom: '30px', zIndex: 1000, backgroundColor: 'white', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
                >
                    <MyLocationIcon />
                </IconButton>
            </div>
            <Snackbar
                open={Boolean(error)}
                autoHideDuration={4000}
                onClose={() => setError('')}
                message={error}
            />
        </div>
    )
}

export default LocationPage
