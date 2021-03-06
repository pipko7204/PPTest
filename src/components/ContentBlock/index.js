import React, {Component} from 'react';
import sha1 from 'sha1';

class ContentBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
        }
    }


    componentDidMount() {

        fetch('http://localhost:5555/http://api.pixlpark.com/oauth/requesttoken')
            .then(requestTokenResponse => requestTokenResponse.json())
            .then((requestTokenResponse) => {
                fetch('http://localhost:5555/http://api.pixlpark.com/oauth/accesstoken?' + new URLSearchParams({
                    oauth_token: requestTokenResponse.RequestToken,
                    grant_type: 'api',
                    username: '38cd79b5f2b2486d86f562e3c43034f8',
                    password: sha1(requestTokenResponse.RequestToken + '8e49ff607b1f46e1a5e8f6ad5d312a80'),
                }))
                    .then(accessTokenResponse => accessTokenResponse.json())
                    .then((accessTokenResponse) => {
                    fetch('http://localhost:5555/http://api.pixlpark.com/orders?' + new URLSearchParams({
                        oauth_token: accessTokenResponse.AccessToken,
                    }))
                        .then(ordersResponse => ordersResponse.json())
                        .then((ordersResponse) => {
                                this.setState({
                                    isLoaded: true,
                                    items: ordersResponse.Result
                                });
                            },
                            (error) => {
                                this.setState({
                                    isLoaded: true,
                                    error
                                })
                            }
                        )
                })
            })


    }

    render() {
        const {error, isLoaded, items} = this.state;
        console.log('###: items', items, isLoaded, error);

        if (error) {
            return <p> Error: {error.message} </p>
        } else if (!isLoaded) {
            return <p> Loading... </p>
        } else {
            return (
                <ul>
                    {items.map(item => (
                        <li key={item.id}>
                            <h3>{item.Title}</h3>
                            <img src={item.PreviewImageUrl} alt="?????????? ???????????? ???????? ???????? ????????????????"/>
                            <p>id: {item.Id} </p>
                            <p>PhotolabId: {item.PhotolabId} </p>
                            <p>CustomId: {item.CustomId} </p>

                            <p>???????????? ??????????????: {item.PaymentStatus}</p>
                            <p>???????????? ????????????: {item.RenderStatus}</p>
                            <p>????????: {item.Price} </p>
                            <p>???????????? ?? ??????????: {item.DiscountTitle}</p>
                            <p>???????? ???? ?????????????? {item.DiscountPrice}. </p>
                            <p>??????????: {item.TotalPrice}</p>
                            <p>UserId: {item.UserId}</p>
                            <li>
                                <h4>????????????????</h4>
                                <p>??????????: {item.DeliveryAddress.City}</p>
                                <p>??????????: {item.DeliveryAddress.AddressLine1}</p>
                                <p>??????: {item.DeliveryAddress.FullName}</p>
                                <p>?????????? ????????????????: {item.DeliveryAddress.Phone}</p>
                                <p>???????????????? ????????????: {item.DeliveryAddress.ZipCode ? item.DeliveryAddress.ZipCode : '-'}</p>
                            </li>
                            <li>
                                <h4>??????????????????</h4>
                                <p>Email: {item.Shipping.Email ? item.Shipping.Email : '-'}</p>
                                <p>id: {item.Shipping.Id}</p>
                                <p>??????????????: {item.Shipping.Phone ? item.Shipping.Phone : '-'}</p>
                                <p>title: {item.Shipping.Title}</p>
                                <p>??????: {item.Shipping.Type === 'Mail' ? '??????????' : '????????????'}</p>
                            </li>
                        </li>
                    ))}
                </ul>
            )
        }
    }
}

export default ContentBlock;