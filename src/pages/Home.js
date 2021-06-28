import React from "react";
import "../css/Home.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useStateValue } from "../components/StateProvider";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    height: 140,
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  root1: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
}));

function Home() {
  const [{ home, products, companies, categories }, dispach] = useStateValue();

  const classes = useStyles();

  return (
    <div className="home">
      <div className="home__container">

        <Carousel className="home__image" showArrows={true} showThumbs={false} stopOnHover={true} infiniteLoop={true}>
          {home && home.data.slides.map(slide => {
            return <div>
              <img style={{ maxHeight: "500px" }} src={slide.slide} alt="örnek" />
              <p className="legend">{slide.title} </p>
            </div>
          })}
        </Carousel>
        {home.data.homeContent && Array.isArray(home.data.homeContent) && home.data.homeContent.map(content => {
          if (content.state !== "active") {
            return "";
          } else {
            if (content.type === "product") {
              const product = products.find(x => x.id === content.content);
              let productArray = product.data.productImages;
              return <div className="home__row">
                <Card className={classes.root1}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={productArray[0]?.url}
                      title={product.data.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.data.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {product.data.category}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      Share
                    </Button>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
                <GridList className={classes.gridList} cols={2.5}>
                  {productArray.map((photo) => (
                    <GridListTile key={photo.url}>
                      <img src={photo.url} alt={photo.title} />
                      <GridListTileBar
                        title={photo.title}
                        classes={{
                          root: classes.titleBar,
                          title: classes.title,
                        }}
                        actionIcon={
                          <IconButton aria-label={`star ${photo.title}`}>
                            <StarBorderIcon className={classes.title} />
                          </IconButton>
                        }
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </div>
            } else if (content.type === "company") {
              const company = companies.find(x => x.id === content.content);
              const companyImages = company.data?.companyImages || [];
              let companyArray = products.filter(x => x.data.productionCompany === company.id);
              console.log(products)
              return <div className="home__row">
                <Card className={classes.root1}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={companyImages[0]?.url}
                      title={company.data.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {company.data.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {company.data.isDealer === "1" ? "Yetkili Bayisiyiz" : "Yetkili Bayisi değiliz"}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      Share
                    </Button>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
                <GridList className={classes.gridList} cols={2.5}>
                  {companyArray.map((product) => (
                    <GridListTile key={product.data.productImages[0].url}>
                      <img src={product.data.productImages[0].url} alt={product.title} />
                      <GridListTileBar
                        title={product.data.title}
                        classes={{
                          root: classes.titleBar,
                          title: classes.title,
                        }}
                        actionIcon={
                          <IconButton aria-label={`star ${product.data.title}`}>
                            <StarBorderIcon className={classes.title} />
                          </IconButton>
                        }
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </div>
            } else if (content.type === "category") {
              const category = categories.find(x => x.id === content.content);
              const categoryImages = category.data?.categoryImages || [];
              let categoryArray = [];
              if (category) {
                categoryArray = products.filter(x => x.productCategory === content.content);
              }
              console.log(category)
              return <div className="home__row">
                <Card className={classes.root1}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={categoryImages[0]?.url}
                      title={category.data.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {category.data.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {category.data.title}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      Share
                    </Button>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
                <GridList className={classes.gridList} cols={2.5}>
                  {categoryArray.map((product) => (
                    <GridListTile key={product.data.productImages[0].url}>
                      <img src={product.data.productImages[0].url} alt={product.title} />
                      <GridListTileBar
                        title={product.title}
                        classes={{
                          root: classes.titleBar,
                          title: classes.title,
                        }}
                        actionIcon={
                          <IconButton aria-label={`star ${product.title}`}>
                            <StarBorderIcon className={classes.title} />
                          </IconButton>
                        }
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </div>
            } else if (content.type === "other") {
              console.log(content?.images)
              return <div className="home__row">
                <Card className={classes.root1}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={content.images[0]?.url}
                      title={content.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {content.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {content.content}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary">
                      Share
                    </Button>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
                <GridList className={classes.gridList} cols={2.5}>
                  {content?.images.map((tile) => (
                    <GridListTile key={tile.url}>
                      <img src={tile.url} alt={tile.title} />
                      <GridListTileBar
                        title={tile.title}
                        classes={{
                          root: classes.titleBar,
                          title: classes.title,
                        }}
                        actionIcon={
                          <IconButton aria-label={`star ${tile.title}`}>
                            <StarBorderIcon className={classes.title} />
                          </IconButton>
                        }
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </div>
            }
          }
        })}
      </div>

    </div>
  );
}

export default Home;
