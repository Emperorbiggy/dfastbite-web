import LandingPage from '../components/landingpage'
import React, { useEffect } from 'react'
import PushNotificationLayout from '../components/PushNotificationLayout'
import Meta from '../components/Meta'
import { setGlobalSettings } from "@/redux/slices/global"
import { useDispatch } from 'react-redux'
import Router, { useRouter } from "next/router";
import { CustomHeader } from "@/api/Headers"
import { checkMaintenanceMode } from "@/utils/customFunctions";

const Home = ({ configData, landingPageData }) => {

    const router = useRouter()
    const dispatch = useDispatch()

    useEffect(() => {
        if (configData && landingPageData) {
            if (configData.length === 0 && landingPageData.length === 0) {
                router.push('/404');
                return;
            }

            if (checkMaintenanceMode(configData)) {
                router.push('/maintenance');
                return;
            }
            dispatch(setGlobalSettings(configData));
        }
    }, [configData, landingPageData, router, dispatch]);

    return (
        <>
            <Meta
                title={configData?.business_name}
                ogImage={`${configData?.base_urls?.react_landing_page_images}/${landingPageData?.banner_section_full?.banner_section_img_full}`}
            />
            <PushNotificationLayout>
                {configData && (
                    <LandingPage
                        global={configData}
                        landingPageData={landingPageData}
                    />
                )}
            </PushNotificationLayout>
        </>
    )
}

export default Home

export const getServerSideProps = async (context) => {
    const { req } = context;
    const language = req.cookies.languageSetting;

    // Directly using the URL instead of process.env
    const BASE_URL = "https://easinovation.com.ng";

    let configData = null;
    let landingPageData = null;

    try {
        const configUrl = `${BASE_URL}/api/v1/config`;
        console.log(`Fetching config data from: ${configUrl}`); // Log full URL

        const configRes = await fetch(configUrl, {
            method: 'GET',
            headers: {
                'X-software-id': 33571750,
                'X-server': 'server',
                'X-localization': language,
                origin: "https://easinovation.com.ng", // Set origin directly
            },
        });

        if (!configRes.ok) {
            console.error(`Error fetching config data from ${configUrl}: ${configRes.status} ${configRes.statusText}`);
            throw new Error(`Failed to fetch config data: ${configRes.status}`);
        }

        configData = await configRes.json();

    } catch (error) {
        console.error('Error in config data fetch:', error);
    }

    try {
        const landingPageUrl = `${BASE_URL}/api/v1/landing-page`;
        console.log(`Fetching landing page data from: ${landingPageUrl}`); // Log full URL

        const landingPageRes = await fetch(landingPageUrl, {
            method: 'GET',
            headers: CustomHeader,
        });

        if (!landingPageRes.ok) {
            console.error(`Error fetching landing page data from ${landingPageUrl}: ${landingPageRes.status} ${landingPageRes.statusText}`);
            throw new Error(`Failed to fetch landing page data: ${landingPageRes.status}`);
        }

        landingPageData = await landingPageRes.json();

    } catch (error) {
        console.error('Error in landing page data fetch:', error);
    }

    return {
        props: {
            configData,
            landingPageData,
        },
    }
}
