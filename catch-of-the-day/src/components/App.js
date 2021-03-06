import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component {
    state = {
        fishes: {},
        order: {}
    };

    componentDidMount() {
        const { params } = this.props.match
        // first reinstate our local storage
        const localStorageRef = localStorage.getItem(params.storeId);

        if(localStorageRef) {
            this.setState({ order: JSON.parse(localStorageRef) });
        }
        this.ref = base.syncState(`${params.storeId}/fishes`, {
            context: this,
            state: 'fishes'
        });
    }
    
    componentDidUpdate() {
        const { params } = this.props.match
        localStorage.setItem(params.storeId, JSON.stringify(this.state.order));
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    addFish = (fish) => {
        // Make a copy to avoid mutation
        const fishes = { ...this.state.fishes };

        // Add our new fish to the fishes var
        fishes[`fish${Date.now()}`] = fish;

        // set the new fishes object to state
        this.setState({
            fishes: fishes
        });
    };

    updateFish = (key, updatedFish) => {
        // 1. take a copy of the current state
        const fishes = {...this.state.fishes};
        // 2. update that state
        fishes[key] = updatedFish;
        //3. set that to state
        this.setState({ fishes });
    }

    deleteFish = (key) => {
        // 1. take a copy of state
        const fishes = { ...this.state.fishes };
        // 2. update the state
        fishes[key] = null;
        // 3. update state
        this.setState({ fishes });
    }

    loadSampleFishes = () => {
        this.setState({
            fishes: sampleFishes
        })
    }

    addToOrder = (key) => {
        // 1. Make a copy of state
        const order = { ...this.state.order };
        // 2. Either add to order, or update the number in our order
        order[key] = order[key] + 1 || 1;
        // 3. Call set state to update our state object
        this.setState({ order: order });
    }
    
    removeFromOrder = (key) => {
        // 1. take a copy of state
        const order = { ...this.state.order };
        // 2. update the state
        delete order[key];
        // 3. set the new state
        this.setState({ order: order });
    }

    render () {
        return(
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh seafood market" />
                    <ul className="fishes">
                        {Object.keys(this.state.fishes).map(key => 
                            <Fish 
                                key={key} 
                                index={key}
                                details={this.state.fishes[key]}   
                                addToOrder={this.addToOrder} 
                            />
                        )}
                    </ul>
                </div>
                <Order 
                    fishes={this.state.fishes} 
                    order={this.state.order}
                    removeFromOrder={this.removeFromOrder} 
                />
                <Inventory 
                    addFish={this.addFish} 
                    updateFish={this.updateFish} 
                    deleteFish={this.deleteFish} 
                    loadSampleFishes={this.loadSampleFishes}
                    fish={this.state.fishes}
                />
            </div>
        )
    }
}

export default App;