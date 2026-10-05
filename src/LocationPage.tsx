import {MapContainer, TileLayer, Marker, Popup, Polygon, AttributionControl} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button, Typography, IconButton, Snackbar, Box, useTheme } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
import { useThemeStore } from './themeStore'
import logo from './assets/uzinfocom-logo.8612a388.svg'

const position: any = [41.3420557, 69.3366532]

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
    const theme = useTheme()
    const mode = useThemeStore((state) => state.mode)
    const primary = theme.palette.primary.main
    
    const icon = L.divIcon({
        html: `<div style="width:100px;height:44px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font-size:22px"><img src="${logo}" style="width:100px"></div>`,
        className: '',
        iconSize: [44, 44],
        iconAnchor: [58, 18],
        popupAnchor: [0, -22]
    })

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
        <Box sx={{ p: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>{t('common.back')}</Button>
            <Typography variant="h4" sx={{ mb: 3 }}>{t('location.title')}</Typography>
            <Box
                sx={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: 6,
                    border: 1,
                    borderColor: 'divider',
                    '& .leaflet-tile-pane': {
                        filter: mode === 'dark' ? 'invert(1) hue-rotate(180deg) brightness(0.85) contrast(0.9) sepia(0.5) hue-rotate(220deg) saturate(1.8)' : 'none',
                    },
                }}
            >
                <MapContainer ref={mapRef} attributionControl={false} center={position} zoom={17} style={{height: "75vh", width: "100%"}}>
                    <TileLayer
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                        attribution='&copy; OpenStreetMap'
                    />
                    <AttributionControl prefix={false}/>
                    <Marker position={position} icon={icon}>
                        <Popup>
                            <b>Uzinfocom</b><br />
                            {t('location.addressLabel')}: {t('location.address')}<br />
                            {t('location.siteLabel')}: <a href="https://uzinfocom.uz" target="_blank">uzinfocom.uz</a><br />
                            {t('location.phoneLabel')}: <a href="tel:+998712022202">+998 71 202-22-02</a>
                        </Popup>
                    </Marker>
                    
                    <Polygon
                        positions={[
                            [41.3418, 69.3366],
                            [41.3422, 69.3359],
                            [41.3427, 69.3365],
                            [41.3423, 69.3372],
                        ]}
                        pathOptions={{ color: primary, weight: 3, fillOpacity: 0.15, dashArray: '6 6' }}
                    />
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
                    sx={{
                        position: 'absolute',
                        right: 20,
                        bottom: 30,
                        zIndex: 1000,
                        width: 48,
                        height: 48,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        boxShadow: 4,
                        '&:hover': { bgcolor: 'primary.dark' },
                    }}
                >
                    <MyLocationIcon />
                </IconButton>
            </Box>
            <Snackbar
                open={Boolean(error)}
                autoHideDuration={4000}
                onClose={() => setError('')}
                message={error}
            />
            
        </Box>
    )
}

export default LocationPage
