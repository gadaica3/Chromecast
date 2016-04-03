'use strict';

import React from 'react';
import {FormattedMessage} from 'react-intl';

class App extends React.Component {
    static ipc = require('electron').ipcRenderer;
    static do(method, param) {
        App.ipc.send('do', method, param);
    }

    constructor(props) {
        super(props);

        this.state = {
            deviceName: '',
            hasNoDevice: true,
            service: '',
            services: []
        };

        // document.addEventListener('drop', this.handleFile);
        // document.addEventListener('dragover', this.handleFile);

        App.ipc.on('connected', this.handleServiceChange);
        App.ipc.on('services', this.handleRemoteServices);
    }

    handleFile = (e) => {
        console.log('App.handleFile()', arguments);
        e.preventDefault();

        if (!this.props.service) {
            e.stopPropagation();
        }
    }

    handleRemoteServices = (event, list) => {
        console.log('handleRemoteServices()', list);
        this.setState({
            deviceName: list && list.length
                ? (list[0].name || '').replace('.local', '')
                : '',
            hasNoDevice: false,
            services: list
        });
    }

    handleServiceChange = (event, service) => {
        console.log('handleServiceChange()', service);
        this.setState({
            service: service
        });
    }

    render() {
        let hasNoDevice = this.state.hasNoDevice,
            title = <FormattedMessage id={hasNoDevice ? 'lookingForChromecast' : 'chooseUrl'} />;

        return (
        <div className="row">
            <div className="col-xs">
                <div className="box">
                    <h2>{ title }</h2>
                    <DevicesList
                        services={ this.state.services }
                        service={ this.state.service }
                        onChange={ this.handleServiceChange }
                        />
                    { this.state.service ? <Player service={this.state.service} /> : false }
                </div>
            </div>
            <div className="col-xs-3 col-md-3" style={{ display: 'none' }}>
                <div className="box">
                    <h2>Playlist</h2>
                    <p>// TODO</p>
                </div>
            </div>
        </div>
        );
    }
}
