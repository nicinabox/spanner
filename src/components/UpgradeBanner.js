import React from 'react'

const UPGRADE_URL = process.env.UPGRADE_URL;

const UpgradeBanner = () => {
    if (!UPGRADE_URL) return null;

    return (
        <div className="upgrade-banner">
            🎉 A new version is coming. <a href={UPGRADE_URL}>Try it out →</a>
        </div>
    )
}

export default UpgradeBanner
