// Note: please remove @ts-nocheck comment in real app, it's here only because it's our local code example.
// @ts-nocheck
import { render } from 'react-dom';
import { UuiContext, HistoryAdaptedRouter, useUuiServices, DragGhost, GAListener, IProcessRequest } from '@epam/uui-core';
import { Modals, Snackbar } from '@epam/uui-components';
import { skinContext, ErrorHandler } from '@epam/promo';
import { createBrowserHistory } from 'history';
import { svc } from '../../../services';
import { Router } from 'react-router';
import * as React from 'react';

const history = createBrowserHistory();
const router = new HistoryAdaptedRouter(history);

/**
 * API definition example
 */
type TApi = ReturnType<typeof apiDefinition>;
function apiDefinition(processRequest: IProcessRequest) {
    return {
        loadDataExample(): Promise<any> {
            return processRequest('url goes here', 'GET');
        },
        loadAppContextData(): Promise<any> {
            return processRequest('url goes here', 'GET');
        },
        // ... other api are defined here
    };
}

/**
 * APP context example
 */
type TAppContext = Awaited<ReturnType<typeof loadAppContext>>;
async function loadAppContext(api: TApi) {
    return await api.loadAppContextData();
}

function UuiEnhancedApp() {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const { services } = useUuiServices<TApi, TAppContext>({
        apiDefinition,
        router,
        skinContext,
    });

    React.useEffect(() => {
        Object.assign(svc, services);
        // listeners are added here
        services.uuiAnalytics.addListener(new GAListener(/** your Google Analytics id goes here */));
        // app context is loaded here
        loadAppContext().then((appCtx) => {
            services.uuiApp = appCtx;
            setIsLoaded(true);
        });
    }, [services]);

    if (isLoaded) {
        return (
            <UuiContext.Provider value={ services }>
                <ErrorHandler>
                    <Router history={ history }>
                        Your App component
                    </Router>
                </ErrorHandler>
                <Snackbar />
                <Modals />
                <DragGhost />
            </UuiContext.Provider>
        );
    }
    return null;
}

render(<UuiEnhancedApp />, document.getElementById('root'));
