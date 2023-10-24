import {useState} from 'react';
import Overview from '../components/OverviewTemplate';

export default function WebVitalsOverview({moduleId}) {
    const [section, setSection] = useState('about');

    return (
        <Overview moduleId={moduleId} section={(val) => setSection(val)} noIntegrate>
            {
                section === 'about' &&
                <section>
                    <h2>What is Web Vitals?</h2>
                    <p>Web Vitals is an initiative by Google to provide unified guidance for quality signals that are essential to delivering a great user experience on the web. This plugin helps you to log data measured by real visitor browser and identify not optimal elements in your HTML content</p>
                </section>
            }
        </Overview>
    );
}
