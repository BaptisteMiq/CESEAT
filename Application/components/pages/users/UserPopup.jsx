
import { StatefulMenu, OptionProfile } from "baseui/menu";
import { Avatar } from "baseui/avatar";
import { Button, SHAPE, SIZE } from "baseui/button";
import { useHistory } from "react-router-dom";

const ITEMS = Array.from({length: 4}, () => ({
    title: 'David Smith',
    subtitle: 'Senior Engineering Manager',
    body: 'Uber Everything',
    imgUrl: 'https://via.placeholder.com/60x60',
  }));

const UserPopup = (props) => {
    let history = useHistory();

    var onClickList = (label) => {
        switch (label) {
            case 'UserParameters':
                history.push('/users/parameters');
                break;
            case "Commandes":
                history.push('/users/orders');
                break;
            case "Promotions":
                history.push('/users/promotions');
                break;
            case "Support":
                history.push('/users/supports');
                break;
        }
    }

    return (
        <div className='UserPopup w-52'> 
           <div className="flex flex-col items-center">
            <div className="m-5 Avatar">
                <Avatar
                        name="Jane Doe"
                        size="scale1600"
                        src="https://via.placeholder.com/120x120"
                        overrides={{
                            Avatar: {
                            style: ({ $theme }) => ({
                                outline: `${$theme.colors.primary400} solid`
                            })
                            }
                        }}
                />
            </div>
            <div className="UserName mb-5">
                { props.user.name }
            </div>
            <div className="UserButton mb-5">
                <Button
                    onClick={() => onClickList('UserParameters')}
                    shape={SHAPE.pill}
                    size={SIZE.compact}
                    >
                    Gestion du compte
                </Button>
            </div>
           </div>
           
           <StatefulMenu
                items={[
                    { label: "Commandes" },
                    { label: "Promotions" },
                    { label: "Support" },
                ]}
                onItemSelect={ props => onClickList(props.item.label)}
            />
        </div>
    );
};

export default UserPopup;
