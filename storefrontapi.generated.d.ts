/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type BabyShopMediaImageFragment = Pick<
  StorefrontAPI.MediaImage,
  'id'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type BabyShopCardItemFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      reference?: StorefrontAPI.Maybe<
        | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          })
      >;
      references?: StorefrontAPI.Maybe<{
        nodes: Array<Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>>;
      }>;
    }
  >;
};

export type BabyShopBannerItemFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      reference?: StorefrontAPI.Maybe<
        | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          })
      >;
      references?: StorefrontAPI.Maybe<{
        nodes: Array<Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>>;
      }>;
    }
  >;
};

export type BabyShopDataNodeFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      reference?: StorefrontAPI.Maybe<
        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          })
        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                reference?: StorefrontAPI.Maybe<
                  | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                >;
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                  >;
                }>;
              }
            >;
          })
      >;
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                reference?: StorefrontAPI.Maybe<
                  | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                >;
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                  >;
                }>;
              }
            >;
          }
        >;
      }>;
    }
  >;
};

export type BabyShopMetaobjectFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      reference?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metaobject, 'id'> & {
          fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>;
        }
      >;
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                reference?: StorefrontAPI.Maybe<
                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                  | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                      fields: Array<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                          reference?: StorefrontAPI.Maybe<
                            | Pick<
                                StorefrontAPI.Collection,
                                'id' | 'handle' | 'title'
                              >
                            | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'url' | 'altText' | 'width' | 'height'
                                  >
                                >;
                              })
                          >;
                          references?: StorefrontAPI.Maybe<{
                            nodes: Array<
                              Pick<
                                StorefrontAPI.Collection,
                                'id' | 'handle' | 'title'
                              >
                            >;
                          }>;
                        }
                      >;
                    })
                >;
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                      fields: Array<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                          reference?: StorefrontAPI.Maybe<
                            | Pick<
                                StorefrontAPI.Collection,
                                'id' | 'handle' | 'title'
                              >
                            | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'url' | 'altText' | 'width' | 'height'
                                  >
                                >;
                              })
                          >;
                          references?: StorefrontAPI.Maybe<{
                            nodes: Array<
                              Pick<
                                StorefrontAPI.Collection,
                                'id' | 'handle' | 'title'
                              >
                            >;
                          }>;
                        }
                      >;
                    }
                  >;
                }>;
              }
            >;
          }
        >;
      }>;
    }
  >;
};

export type HomePageBabyShopQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HomePageBabyShopQuery = {
  babyShopMetaobject?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metaobject, 'id'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
            }
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                >;
                              }>;
                            }
                          >;
                        }
                      >;
                    }>;
                  }
                >;
              }
            >;
          }>;
        }
      >;
    }
  >;
  babyShopDataMetaobjects: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
            reference?: StorefrontAPI.Maybe<
              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        >;
                      }>;
                    }
                  >;
                })
            >;
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        >;
                      }>;
                    }
                  >;
                }
              >;
            }>;
          }
        >;
      }
    >;
  };
};

export type HeroSliderSlideFieldsFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle' | 'type'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      reference?: StorefrontAPI.Maybe<
        | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          })
        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                reference?: StorefrontAPI.Maybe<
                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                  | (Pick<
                      StorefrontAPI.Metaobject,
                      'id' | 'handle' | 'type'
                    > & {
                      fields: Array<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                          reference?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            }
                          >;
                        }
                      >;
                    })
                >;
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Metaobject,
                        'id' | 'handle' | 'type'
                      > & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.MediaImage, 'id'> & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'url' | 'altText' | 'width' | 'height'
                                  >
                                >;
                              }
                            >;
                          }
                        >;
                      })
                  >;
                }>;
              }
            >;
          })
      >;
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
          | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                  reference?: StorefrontAPI.Maybe<
                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Metaobject,
                        'id' | 'handle' | 'type'
                      > & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.MediaImage, 'id'> & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'url' | 'altText' | 'width' | 'height'
                                  >
                                >;
                              }
                            >;
                            references?: StorefrontAPI.Maybe<{
                              nodes: Array<
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'handle' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value'
                                      > & {
                                        reference?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.MediaImage,
                                            'id'
                                          > & {
                                            image?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.Image,
                                                | 'url'
                                                | 'altText'
                                                | 'width'
                                                | 'height'
                                              >
                                            >;
                                          }
                                        >;
                                      }
                                    >;
                                  })
                              >;
                            }>;
                          }
                        >;
                      })
                  >;
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Metaobject,
                          'id' | 'handle' | 'type'
                        > & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                Pick<StorefrontAPI.MediaImage, 'id'> & {
                                  image?: StorefrontAPI.Maybe<
                                    Pick<
                                      StorefrontAPI.Image,
                                      'url' | 'altText' | 'width' | 'height'
                                    >
                                  >;
                                }
                              >;
                            }
                          >;
                        })
                    >;
                  }>;
                }
              >;
            })
        >;
      }>;
    }
  >;
};

export type HeroSliderMetaobjectFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle' | 'type'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      reference?: StorefrontAPI.Maybe<
        | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          })
        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          })
        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                reference?: StorefrontAPI.Maybe<
                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                  | (Pick<
                      StorefrontAPI.Metaobject,
                      'id' | 'handle' | 'type'
                    > & {
                      fields: Array<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                          reference?: StorefrontAPI.Maybe<
                            | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'url' | 'altText' | 'width' | 'height'
                                  >
                                >;
                              })
                            | (Pick<
                                StorefrontAPI.Metaobject,
                                'id' | 'handle' | 'type'
                              > & {
                                fields: Array<
                                  Pick<
                                    StorefrontAPI.MetaobjectField,
                                    'key' | 'value'
                                  > & {
                                    reference?: StorefrontAPI.Maybe<
                                      Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      }
                                    >;
                                  }
                                >;
                              })
                          >;
                          references?: StorefrontAPI.Maybe<{
                            nodes: Array<
                              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                  image?: StorefrontAPI.Maybe<
                                    Pick<
                                      StorefrontAPI.Image,
                                      'url' | 'altText' | 'width' | 'height'
                                    >
                                  >;
                                })
                              | (Pick<
                                  StorefrontAPI.Metaobject,
                                  'id' | 'handle' | 'type'
                                > & {
                                  fields: Array<
                                    Pick<
                                      StorefrontAPI.MetaobjectField,
                                      'key' | 'value'
                                    > & {
                                      reference?: StorefrontAPI.Maybe<
                                        Pick<StorefrontAPI.MediaImage, 'id'> & {
                                          image?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.Image,
                                              | 'url'
                                              | 'altText'
                                              | 'width'
                                              | 'height'
                                            >
                                          >;
                                        }
                                      >;
                                    }
                                  >;
                                })
                            >;
                          }>;
                        }
                      >;
                    })
                >;
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Metaobject,
                        'id' | 'handle' | 'type'
                      > & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.MediaImage, 'id'> & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'url' | 'altText' | 'width' | 'height'
                                  >
                                >;
                              }
                            >;
                          }
                        >;
                      })
                  >;
                }>;
              }
            >;
          })
        | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          })
      >;
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
          | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                  reference?: StorefrontAPI.Maybe<
                    | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      })
                    | (Pick<
                        StorefrontAPI.Metaobject,
                        'id' | 'handle' | 'type'
                      > & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                  image?: StorefrontAPI.Maybe<
                                    Pick<
                                      StorefrontAPI.Image,
                                      'url' | 'altText' | 'width' | 'height'
                                    >
                                  >;
                                })
                              | (Pick<
                                  StorefrontAPI.Metaobject,
                                  'id' | 'handle' | 'type'
                                > & {
                                  fields: Array<
                                    Pick<
                                      StorefrontAPI.MetaobjectField,
                                      'key' | 'value'
                                    > & {
                                      reference?: StorefrontAPI.Maybe<
                                        Pick<StorefrontAPI.MediaImage, 'id'> & {
                                          image?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.Image,
                                              | 'url'
                                              | 'altText'
                                              | 'width'
                                              | 'height'
                                            >
                                          >;
                                        }
                                      >;
                                    }
                                  >;
                                })
                            >;
                            references?: StorefrontAPI.Maybe<{
                              nodes: Array<
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'handle' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value'
                                      > & {
                                        reference?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.MediaImage,
                                            'id'
                                          > & {
                                            image?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.Image,
                                                | 'url'
                                                | 'altText'
                                                | 'width'
                                                | 'height'
                                              >
                                            >;
                                          }
                                        >;
                                      }
                                    >;
                                  })
                              >;
                            }>;
                          }
                        >;
                      })
                  >;
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Metaobject,
                          'id' | 'handle' | 'type'
                        > & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'handle' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value'
                                      > & {
                                        reference?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.MediaImage,
                                            'id'
                                          > & {
                                            image?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.Image,
                                                | 'url'
                                                | 'altText'
                                                | 'width'
                                                | 'height'
                                              >
                                            >;
                                          }
                                        >;
                                        references?: StorefrontAPI.Maybe<{
                                          nodes: Array<
                                            | (Pick<
                                                StorefrontAPI.MediaImage,
                                                'id'
                                              > & {
                                                image?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.Image,
                                                    | 'url'
                                                    | 'altText'
                                                    | 'width'
                                                    | 'height'
                                                  >
                                                >;
                                              })
                                            | (Pick<
                                                StorefrontAPI.Metaobject,
                                                'id' | 'handle' | 'type'
                                              > & {
                                                fields: Array<
                                                  Pick<
                                                    StorefrontAPI.MetaobjectField,
                                                    'key' | 'value'
                                                  > & {
                                                    reference?: StorefrontAPI.Maybe<
                                                      Pick<
                                                        StorefrontAPI.MediaImage,
                                                        'id'
                                                      > & {
                                                        image?: StorefrontAPI.Maybe<
                                                          Pick<
                                                            StorefrontAPI.Image,
                                                            | 'url'
                                                            | 'altText'
                                                            | 'width'
                                                            | 'height'
                                                          >
                                                        >;
                                                      }
                                                    >;
                                                  }
                                                >;
                                              })
                                          >;
                                        }>;
                                      }
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                  | (Pick<
                                      StorefrontAPI.Metaobject,
                                      'id' | 'handle' | 'type'
                                    > & {
                                      fields: Array<
                                        Pick<
                                          StorefrontAPI.MetaobjectField,
                                          'key' | 'value'
                                        > & {
                                          reference?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.MediaImage,
                                              'id'
                                            > & {
                                              image?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.Image,
                                                  | 'url'
                                                  | 'altText'
                                                  | 'width'
                                                  | 'height'
                                                >
                                              >;
                                            }
                                          >;
                                        }
                                      >;
                                    })
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                  }>;
                }
              >;
            })
          | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
              featuredImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
        >;
      }>;
    }
  >;
};

export type ShowcaseMediaImageFragment = Pick<
  StorefrontAPI.MediaImage,
  'id'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type ShowcaseBannerItemFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      reference?: StorefrontAPI.Maybe<
        | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          })
      >;
      references?: StorefrontAPI.Maybe<{
        nodes: Array<Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>>;
      }>;
    }
  >;
};

export type ShowcaseCardItemFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      reference?: StorefrontAPI.Maybe<
        | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          })
      >;
      references?: StorefrontAPI.Maybe<{
        nodes: Array<Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>>;
      }>;
    }
  >;
};

export type ShowcaseDataNodeFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle' | 'type'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      reference?: StorefrontAPI.Maybe<
        | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          })
        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                reference?: StorefrontAPI.Maybe<
                  | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                >;
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                  >;
                }>;
              }
            >;
          })
      >;
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
          | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                  reference?: StorefrontAPI.Maybe<
                    | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      })
                  >;
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                    >;
                  }>;
                }
              >;
            })
        >;
      }>;
    }
  >;
};

export type ShowcaseSectionMetaobjectFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle' | 'type'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      reference?: StorefrontAPI.Maybe<
        | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                reference?: StorefrontAPI.Maybe<
                  | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                  | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                      fields: Array<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                          reference?: StorefrontAPI.Maybe<
                            | Pick<
                                StorefrontAPI.Collection,
                                'id' | 'handle' | 'title'
                              >
                            | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'url' | 'altText' | 'width' | 'height'
                                  >
                                >;
                              })
                          >;
                          references?: StorefrontAPI.Maybe<{
                            nodes: Array<
                              Pick<
                                StorefrontAPI.Collection,
                                'id' | 'handle' | 'title'
                              >
                            >;
                          }>;
                        }
                      >;
                    })
                >;
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                    | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              | Pick<
                                  StorefrontAPI.Collection,
                                  'id' | 'handle' | 'title'
                                >
                              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                  image?: StorefrontAPI.Maybe<
                                    Pick<
                                      StorefrontAPI.Image,
                                      'url' | 'altText' | 'width' | 'height'
                                    >
                                  >;
                                })
                            >;
                            references?: StorefrontAPI.Maybe<{
                              nodes: Array<
                                Pick<
                                  StorefrontAPI.Collection,
                                  'id' | 'handle' | 'title'
                                >
                              >;
                            }>;
                          }
                        >;
                      })
                  >;
                }>;
              }
            >;
          })
      >;
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
          | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                  reference?: StorefrontAPI.Maybe<
                    | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      })
                    | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value'
                          > & {
                            reference?: StorefrontAPI.Maybe<
                              | Pick<
                                  StorefrontAPI.Collection,
                                  'id' | 'handle' | 'title'
                                >
                              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                  image?: StorefrontAPI.Maybe<
                                    Pick<
                                      StorefrontAPI.Image,
                                      'url' | 'altText' | 'width' | 'height'
                                    >
                                  >;
                                })
                            >;
                            references?: StorefrontAPI.Maybe<{
                              nodes: Array<
                                Pick<
                                  StorefrontAPI.Collection,
                                  'id' | 'handle' | 'title'
                                >
                              >;
                            }>;
                          }
                        >;
                      })
                  >;
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      | Pick<
                          StorefrontAPI.Collection,
                          'id' | 'handle' | 'title'
                        >
                      | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                  }>;
                }
              >;
            })
        >;
      }>;
    }
  >;
};

export type HomePageSectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HomePageSectionsQuery = {
  homePageSections: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
            reference?: StorefrontAPI.Maybe<
              | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | Pick<
                              StorefrontAPI.Collection,
                              'id' | 'handle' | 'title'
                            >
                          | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                      }>;
                    }
                  >;
                })
            >;
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                    fields: Array<
                      Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                        reference?: StorefrontAPI.Maybe<
                          | Pick<
                              StorefrontAPI.Collection,
                              'id' | 'handle' | 'title'
                            >
                          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                        references?: StorefrontAPI.Maybe<{
                          nodes: Array<
                            | Pick<
                                StorefrontAPI.Collection,
                                'id' | 'handle' | 'title'
                              >
                            | (Pick<
                                StorefrontAPI.Metaobject,
                                'id' | 'handle'
                              > & {
                                fields: Array<
                                  Pick<
                                    StorefrontAPI.MetaobjectField,
                                    'key' | 'value'
                                  > & {
                                    reference?: StorefrontAPI.Maybe<
                                      | Pick<
                                          StorefrontAPI.Collection,
                                          'id' | 'handle' | 'title'
                                        >
                                      | (Pick<
                                          StorefrontAPI.MediaImage,
                                          'id'
                                        > & {
                                          image?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.Image,
                                              | 'url'
                                              | 'altText'
                                              | 'width'
                                              | 'height'
                                            >
                                          >;
                                        })
                                    >;
                                    references?: StorefrontAPI.Maybe<{
                                      nodes: Array<
                                        Pick<
                                          StorefrontAPI.Collection,
                                          'id' | 'handle' | 'title'
                                        >
                                      >;
                                    }>;
                                  }
                                >;
                              })
                          >;
                        }>;
                      }
                    >;
                  })
              >;
            }>;
          }
        >;
      }
    >;
  };
};

export type HomePageShowcaseSectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HomePageShowcaseSectionsQuery = {
  bestsellers?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
            | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<
                      | Pick<
                          StorefrontAPI.Collection,
                          'id' | 'handle' | 'title'
                        >
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                    }>;
                  }
                >;
              })
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | Pick<
                              StorefrontAPI.Collection,
                              'id' | 'handle' | 'title'
                            >
                          | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                      }>;
                    }
                  >;
                })
            >;
          }>;
        }
      >;
    }
  >;
  topBrands?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
            | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<
                      | Pick<
                          StorefrontAPI.Collection,
                          'id' | 'handle' | 'title'
                        >
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                    }>;
                  }
                >;
              })
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | Pick<
                              StorefrontAPI.Collection,
                              'id' | 'handle' | 'title'
                            >
                          | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                      }>;
                    }
                  >;
                })
            >;
          }>;
        }
      >;
    }
  >;
  festiveEdit?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
            | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<
                      | Pick<
                          StorefrontAPI.Collection,
                          'id' | 'handle' | 'title'
                        >
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                    }>;
                  }
                >;
              })
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | Pick<
                              StorefrontAPI.Collection,
                              'id' | 'handle' | 'title'
                            >
                          | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                      }>;
                    }
                  >;
                })
            >;
          }>;
        }
      >;
    }
  >;
  homeLiving?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
            | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<
                      | Pick<
                          StorefrontAPI.Collection,
                          'id' | 'handle' | 'title'
                        >
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                    }>;
                  }
                >;
              })
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | Pick<
                              StorefrontAPI.Collection,
                              'id' | 'handle' | 'title'
                            >
                          | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                      }>;
                    }
                  >;
                })
            >;
          }>;
        }
      >;
    }
  >;
  babyShop?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
            | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<
                      | Pick<
                          StorefrontAPI.Collection,
                          'id' | 'handle' | 'title'
                        >
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  Pick<
                                    StorefrontAPI.Collection,
                                    'id' | 'handle' | 'title'
                                  >
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                    }>;
                  }
                >;
              })
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    Pick<
                                      StorefrontAPI.Collection,
                                      'id' | 'handle' | 'title'
                                    >
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | Pick<
                              StorefrontAPI.Collection,
                              'id' | 'handle' | 'title'
                            >
                          | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      Pick<
                                        StorefrontAPI.Collection,
                                        'id' | 'handle' | 'title'
                                      >
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                      }>;
                    }
                  >;
                })
            >;
          }>;
        }
      >;
    }
  >;
};

export type DepartmentImageFragment = {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type DepartmentLeafFieldFragment = Pick<
  StorefrontAPI.MetaobjectField,
  'key' | 'value'
> & {
  reference?: StorefrontAPI.Maybe<
    | {
        __typename:
          | 'Article'
          | 'GenericFile'
          | 'Metaobject'
          | 'Model3d'
          | 'Page'
          | 'Product'
          | 'ProductVariant'
          | 'Video';
      }
    | ({__typename: 'Collection'} & Pick<StorefrontAPI.Collection, 'handle'>)
    | ({__typename: 'MediaImage'} & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
      })
  >;
};

export type DepartmentEntryFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle' | 'type'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      references?: StorefrontAPI.Maybe<{
        nodes: Array<
          Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                reference?: StorefrontAPI.Maybe<
                  | {
                      __typename:
                        | 'Article'
                        | 'GenericFile'
                        | 'Metaobject'
                        | 'Model3d'
                        | 'Page'
                        | 'Product'
                        | 'ProductVariant'
                        | 'Video';
                    }
                  | ({__typename: 'Collection'} & Pick<
                      StorefrontAPI.Collection,
                      'handle'
                    >)
                  | ({__typename: 'MediaImage'} & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                >;
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                      fields: Array<
                        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                          reference?: StorefrontAPI.Maybe<
                            | {
                                __typename:
                                  | 'Article'
                                  | 'GenericFile'
                                  | 'Metaobject'
                                  | 'Model3d'
                                  | 'Page'
                                  | 'Product'
                                  | 'ProductVariant'
                                  | 'Video';
                              }
                            | ({__typename: 'Collection'} & Pick<
                                StorefrontAPI.Collection,
                                'handle'
                              >)
                            | ({__typename: 'MediaImage'} & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'url' | 'altText' | 'width' | 'height'
                                  >
                                >;
                              })
                          >;
                        }
                      >;
                    }
                  >;
                }>;
              }
            >;
          }
        >;
      }>;
    }
  >;
};

export type DepartmentMetaobjectsQueryVariables = StorefrontAPI.Exact<{
  type: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type DepartmentMetaobjectsQuery = {
  departmentMetaobjects: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | {
                            __typename:
                              | 'Article'
                              | 'GenericFile'
                              | 'Metaobject'
                              | 'Model3d'
                              | 'Page'
                              | 'Product'
                              | 'ProductVariant'
                              | 'Video';
                          }
                        | ({__typename: 'Collection'} & Pick<
                            StorefrontAPI.Collection,
                            'handle'
                          >)
                        | ({__typename: 'MediaImage'} & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          Pick<
                            StorefrontAPI.Metaobject,
                            'id' | 'handle' | 'type'
                          > & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | {
                                      __typename:
                                        | 'Article'
                                        | 'GenericFile'
                                        | 'Metaobject'
                                        | 'Model3d'
                                        | 'Page'
                                        | 'Product'
                                        | 'ProductVariant'
                                        | 'Video';
                                    }
                                  | ({__typename: 'Collection'} & Pick<
                                      StorefrontAPI.Collection,
                                      'handle'
                                    >)
                                  | ({__typename: 'MediaImage'} & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                >;
                              }
                            >;
                          }
                        >;
                      }>;
                    }
                  >;
                }
              >;
            }>;
          }
        >;
      }
    >;
  };
};

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  discountAllocations: Array<
    | (Pick<StorefrontAPI.CartAutomaticDiscountAllocation, 'title'> & {
        discountedAmount: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
      })
    | (Pick<StorefrontAPI.CartCodeDiscountAllocation, 'code'> & {
        discountedAmount: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
      })
    | (Pick<StorefrontAPI.CartCustomDiscountAllocation, 'title'> & {
        discountedAmount: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
      })
  >;
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    | 'id'
    | 'availableForSale'
    | 'quantityAvailable'
    | 'requiresShipping'
    | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
  parentRelationship?: StorefrontAPI.Maybe<{
    parent: Pick<StorefrontAPI.CartLine, 'id'>;
  }>;
};

export type CartLineComponentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  discountAllocations: Array<
    | (Pick<StorefrontAPI.CartAutomaticDiscountAllocation, 'title'> & {
        discountedAmount: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
      })
    | (Pick<StorefrontAPI.CartCodeDiscountAllocation, 'code'> & {
        discountedAmount: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
      })
    | (Pick<StorefrontAPI.CartCustomDiscountAllocation, 'title'> & {
        discountedAmount: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
      })
  >;
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    | 'id'
    | 'availableForSale'
    | 'quantityAvailable'
    | 'requiresShipping'
    | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
  lineComponents: Array<
    Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
      attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
      cost: {
        totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        amountPerQuantity: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
        compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
      };
      discountAllocations: Array<
        | (Pick<StorefrontAPI.CartAutomaticDiscountAllocation, 'title'> & {
            discountedAmount: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
          })
        | (Pick<StorefrontAPI.CartCodeDiscountAllocation, 'code'> & {
            discountedAmount: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
          })
        | (Pick<StorefrontAPI.CartCustomDiscountAllocation, 'title'> & {
            discountedAmount: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
          })
      >;
      merchandise: Pick<
        StorefrontAPI.ProductVariant,
        | 'id'
        | 'availableForSale'
        | 'quantityAvailable'
        | 'requiresShipping'
        | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        product: Pick<
          StorefrontAPI.Product,
          'handle' | 'title' | 'id' | 'vendor'
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      };
      parentRelationship?: StorefrontAPI.Maybe<{
        parent: Pick<StorefrontAPI.CartLine, 'id'>;
      }>;
    }
  >;
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  appliedGiftCards: Array<
    Pick<StorefrontAPI.AppliedGiftCard, 'id' | 'lastCharacters'> & {
      amountUsed: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            subtotalAmount: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          discountAllocations: Array<
            | (Pick<StorefrontAPI.CartAutomaticDiscountAllocation, 'title'> & {
                discountedAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
              })
            | (Pick<StorefrontAPI.CartCodeDiscountAllocation, 'code'> & {
                discountedAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
              })
            | (Pick<StorefrontAPI.CartCustomDiscountAllocation, 'title'> & {
                discountedAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
              })
          >;
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            | 'id'
            | 'availableForSale'
            | 'quantityAvailable'
            | 'requiresShipping'
            | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
          parentRelationship?: StorefrontAPI.Maybe<{
            parent: Pick<StorefrontAPI.CartLine, 'id'>;
          }>;
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            subtotalAmount: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          discountAllocations: Array<
            | (Pick<StorefrontAPI.CartAutomaticDiscountAllocation, 'title'> & {
                discountedAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
              })
            | (Pick<StorefrontAPI.CartCodeDiscountAllocation, 'code'> & {
                discountedAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
              })
            | (Pick<StorefrontAPI.CartCustomDiscountAllocation, 'title'> & {
                discountedAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
              })
          >;
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            | 'id'
            | 'availableForSale'
            | 'quantityAvailable'
            | 'requiresShipping'
            | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
          lineComponents: Array<
            Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
              attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
              cost: {
                totalAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                subtotalAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                amountPerQuantity: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
              };
              discountAllocations: Array<
                | (Pick<
                    StorefrontAPI.CartAutomaticDiscountAllocation,
                    'title'
                  > & {
                    discountedAmount: Pick<
                      StorefrontAPI.MoneyV2,
                      'currencyCode' | 'amount'
                    >;
                  })
                | (Pick<StorefrontAPI.CartCodeDiscountAllocation, 'code'> & {
                    discountedAmount: Pick<
                      StorefrontAPI.MoneyV2,
                      'currencyCode' | 'amount'
                    >;
                  })
                | (Pick<StorefrontAPI.CartCustomDiscountAllocation, 'title'> & {
                    discountedAmount: Pick<
                      StorefrontAPI.MoneyV2,
                      'currencyCode' | 'amount'
                    >;
                  })
              >;
              merchandise: Pick<
                StorefrontAPI.ProductVariant,
                | 'id'
                | 'availableForSale'
                | 'quantityAvailable'
                | 'requiresShipping'
                | 'title'
              > & {
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                product: Pick<
                  StorefrontAPI.Product,
                  'handle' | 'title' | 'id' | 'vendor'
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
              };
              parentRelationship?: StorefrontAPI.Maybe<{
                parent: Pick<StorefrontAPI.CartLine, 'id'>;
              }>;
            }
          >;
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
  discountAllocations: Array<
    | (Pick<StorefrontAPI.CartAutomaticDiscountAllocation, 'title'> & {
        discountedAmount: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
      })
    | (Pick<StorefrontAPI.CartCodeDiscountAllocation, 'code'> & {
        discountedAmount: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
      })
    | (Pick<StorefrontAPI.CartCustomDiscountAllocation, 'title'> & {
        discountedAmount: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
      })
  >;
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type GrandChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type AnnouncementBarMetaobjectFragment = Pick<
  StorefrontAPI.Metaobject,
  'id' | 'handle' | 'type'
> & {
  fields: Array<
    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
      reference?: StorefrontAPI.Maybe<
        | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText'>
            >;
          })
        | Pick<StorefrontAPI.Page, 'id' | 'handle' | 'title'>
        | Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'>
      >;
    }
  >;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  topBar?: StorefrontAPI.Maybe<{
    fields: Array<
      Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
        references?: StorefrontAPI.Maybe<{
          nodes: Array<{
            fields: Array<
              Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                reference?: StorefrontAPI.Maybe<{
                  image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
                }>;
              }
            >;
          }>;
        }>;
      }
    >;
  }>;
  announcementBarMetaobject?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
            | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url' | 'altText'>
                >;
              })
            | Pick<StorefrontAPI.Page, 'id' | 'handle' | 'title'>
            | Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'>
          >;
        }
      >;
    }
  >;
  announcementBarMetaobjects: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
            reference?: StorefrontAPI.Maybe<
              | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Image, 'url' | 'altText'>
                  >;
                })
              | Pick<StorefrontAPI.Page, 'id' | 'handle' | 'title'>
              | Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'>
            >;
          }
        >;
      }
    >;
  };
  mobileHeroCategories?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                  reference?: StorefrontAPI.Maybe<
                    | Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                    | {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      }
                  >;
                  references?: StorefrontAPI.Maybe<{
                    nodes: Array<
                      Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'>
                    >;
                  }>;
                }
              >;
            }
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              Pick<StorefrontAPI.Metaobject, 'id' | 'handle'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<
                      | Pick<
                          StorefrontAPI.Collection,
                          'id' | 'handle' | 'title'
                        >
                      | {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        }
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        Pick<
                          StorefrontAPI.Collection,
                          'id' | 'handle' | 'title'
                        >
                      >;
                    }>;
                  }
                >;
              }
            >;
          }>;
        }
      >;
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  moreMenu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  helpMenu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  footerWomen?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  footerMen?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  footerKids?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  footerHomeLiving?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  footerFootwear?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  footerBeauty?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  footerBags?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  footerBabyshop?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
  metaobjects: {
    nodes: Array<{
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            | {
                image?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url' | 'altText'>
                >;
              }
            | {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<{
                      image?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Image, 'url' | 'altText'>
                      >;
                    }>;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<{
                        fields: Array<
                          Pick<
                            StorefrontAPI.MetaobjectField,
                            'key' | 'value'
                          > & {
                            reference?: StorefrontAPI.Maybe<{
                              image?: StorefrontAPI.Maybe<
                                Pick<StorefrontAPI.Image, 'url' | 'altText'>
                              >;
                            }>;
                          }
                        >;
                      }>;
                    }>;
                  }
                >;
              }
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<{
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                  reference?: StorefrontAPI.Maybe<{
                    image?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url' | 'altText'>
                    >;
                  }>;
                }
              >;
            }>;
          }>;
        }
      >;
    }>;
  };
};

export type MainHeaderMetaobjectQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type MainHeaderMetaobjectQuery = {
  metaobject?: StorefrontAPI.Maybe<{
    fields: Array<
      Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
        reference?: StorefrontAPI.Maybe<
          | {image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>}
          | {
              fields: Array<
                Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>
              >;
            }
        >;
      }
    >;
  }>;
};

export type HomePageHeroSliderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HomePageHeroSliderQuery = {
  heroSliderMetaobject?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
            | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
            | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Metaobject,
                          'id' | 'handle' | 'type'
                        > & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'handle' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value'
                                      > & {
                                        reference?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.MediaImage,
                                            'id'
                                          > & {
                                            image?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.Image,
                                                | 'url'
                                                | 'altText'
                                                | 'width'
                                                | 'height'
                                              >
                                            >;
                                          }
                                        >;
                                      }
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                  | (Pick<
                                      StorefrontAPI.Metaobject,
                                      'id' | 'handle' | 'type'
                                    > & {
                                      fields: Array<
                                        Pick<
                                          StorefrontAPI.MetaobjectField,
                                          'key' | 'value'
                                        > & {
                                          reference?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.MediaImage,
                                              'id'
                                            > & {
                                              image?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.Image,
                                                  | 'url'
                                                  | 'altText'
                                                  | 'width'
                                                  | 'height'
                                                >
                                              >;
                                            }
                                          >;
                                        }
                                      >;
                                    })
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.Metaobject,
                            'id' | 'handle' | 'type'
                          > & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  }
                                >;
                              }
                            >;
                          })
                      >;
                    }>;
                  }
                >;
              })
            | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                featuredImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.Metaobject,
                            'id' | 'handle' | 'type'
                          > & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                  | (Pick<
                                      StorefrontAPI.Metaobject,
                                      'id' | 'handle' | 'type'
                                    > & {
                                      fields: Array<
                                        Pick<
                                          StorefrontAPI.MetaobjectField,
                                          'key' | 'value'
                                        > & {
                                          reference?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.MediaImage,
                                              'id'
                                            > & {
                                              image?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.Image,
                                                  | 'url'
                                                  | 'altText'
                                                  | 'width'
                                                  | 'height'
                                                >
                                              >;
                                            }
                                          >;
                                        }
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'handle' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value'
                                          > & {
                                            reference?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.MediaImage,
                                                'id'
                                              > & {
                                                image?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.Image,
                                                    | 'url'
                                                    | 'altText'
                                                    | 'width'
                                                    | 'height'
                                                  >
                                                >;
                                              }
                                            >;
                                          }
                                        >;
                                      })
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Metaobject,
                              'id' | 'handle' | 'type'
                            > & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'handle' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value'
                                          > & {
                                            reference?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.MediaImage,
                                                'id'
                                              > & {
                                                image?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.Image,
                                                    | 'url'
                                                    | 'altText'
                                                    | 'width'
                                                    | 'height'
                                                  >
                                                >;
                                              }
                                            >;
                                            references?: StorefrontAPI.Maybe<{
                                              nodes: Array<
                                                | (Pick<
                                                    StorefrontAPI.MediaImage,
                                                    'id'
                                                  > & {
                                                    image?: StorefrontAPI.Maybe<
                                                      Pick<
                                                        StorefrontAPI.Image,
                                                        | 'url'
                                                        | 'altText'
                                                        | 'width'
                                                        | 'height'
                                                      >
                                                    >;
                                                  })
                                                | (Pick<
                                                    StorefrontAPI.Metaobject,
                                                    'id' | 'handle' | 'type'
                                                  > & {
                                                    fields: Array<
                                                      Pick<
                                                        StorefrontAPI.MetaobjectField,
                                                        'key' | 'value'
                                                      > & {
                                                        reference?: StorefrontAPI.Maybe<
                                                          Pick<
                                                            StorefrontAPI.MediaImage,
                                                            'id'
                                                          > & {
                                                            image?: StorefrontAPI.Maybe<
                                                              Pick<
                                                                StorefrontAPI.Image,
                                                                | 'url'
                                                                | 'altText'
                                                                | 'width'
                                                                | 'height'
                                                              >
                                                            >;
                                                          }
                                                        >;
                                                      }
                                                    >;
                                                  })
                                              >;
                                            }>;
                                          }
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      | (Pick<
                                          StorefrontAPI.MediaImage,
                                          'id'
                                        > & {
                                          image?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.Image,
                                              | 'url'
                                              | 'altText'
                                              | 'width'
                                              | 'height'
                                            >
                                          >;
                                        })
                                      | (Pick<
                                          StorefrontAPI.Metaobject,
                                          'id' | 'handle' | 'type'
                                        > & {
                                          fields: Array<
                                            Pick<
                                              StorefrontAPI.MetaobjectField,
                                              'key' | 'value'
                                            > & {
                                              reference?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.MediaImage,
                                                  'id'
                                                > & {
                                                  image?: StorefrontAPI.Maybe<
                                                    Pick<
                                                      StorefrontAPI.Image,
                                                      | 'url'
                                                      | 'altText'
                                                      | 'width'
                                                      | 'height'
                                                    >
                                                  >;
                                                }
                                              >;
                                            }
                                          >;
                                        })
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                      }>;
                    }
                  >;
                })
              | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                  featuredImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
            >;
          }>;
        }
      >;
    }
  >;
  homePageBannerMetaobject?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
            | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
            | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Metaobject,
                          'id' | 'handle' | 'type'
                        > & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'handle' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value'
                                      > & {
                                        reference?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.MediaImage,
                                            'id'
                                          > & {
                                            image?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.Image,
                                                | 'url'
                                                | 'altText'
                                                | 'width'
                                                | 'height'
                                              >
                                            >;
                                          }
                                        >;
                                      }
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                  | (Pick<
                                      StorefrontAPI.Metaobject,
                                      'id' | 'handle' | 'type'
                                    > & {
                                      fields: Array<
                                        Pick<
                                          StorefrontAPI.MetaobjectField,
                                          'key' | 'value'
                                        > & {
                                          reference?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.MediaImage,
                                              'id'
                                            > & {
                                              image?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.Image,
                                                  | 'url'
                                                  | 'altText'
                                                  | 'width'
                                                  | 'height'
                                                >
                                              >;
                                            }
                                          >;
                                        }
                                      >;
                                    })
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.Metaobject,
                            'id' | 'handle' | 'type'
                          > & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  }
                                >;
                              }
                            >;
                          })
                      >;
                    }>;
                  }
                >;
              })
            | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                featuredImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.Metaobject,
                            'id' | 'handle' | 'type'
                          > & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                  | (Pick<
                                      StorefrontAPI.Metaobject,
                                      'id' | 'handle' | 'type'
                                    > & {
                                      fields: Array<
                                        Pick<
                                          StorefrontAPI.MetaobjectField,
                                          'key' | 'value'
                                        > & {
                                          reference?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.MediaImage,
                                              'id'
                                            > & {
                                              image?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.Image,
                                                  | 'url'
                                                  | 'altText'
                                                  | 'width'
                                                  | 'height'
                                                >
                                              >;
                                            }
                                          >;
                                        }
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'handle' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value'
                                          > & {
                                            reference?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.MediaImage,
                                                'id'
                                              > & {
                                                image?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.Image,
                                                    | 'url'
                                                    | 'altText'
                                                    | 'width'
                                                    | 'height'
                                                  >
                                                >;
                                              }
                                            >;
                                          }
                                        >;
                                      })
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Metaobject,
                              'id' | 'handle' | 'type'
                            > & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'handle' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value'
                                          > & {
                                            reference?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.MediaImage,
                                                'id'
                                              > & {
                                                image?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.Image,
                                                    | 'url'
                                                    | 'altText'
                                                    | 'width'
                                                    | 'height'
                                                  >
                                                >;
                                              }
                                            >;
                                            references?: StorefrontAPI.Maybe<{
                                              nodes: Array<
                                                | (Pick<
                                                    StorefrontAPI.MediaImage,
                                                    'id'
                                                  > & {
                                                    image?: StorefrontAPI.Maybe<
                                                      Pick<
                                                        StorefrontAPI.Image,
                                                        | 'url'
                                                        | 'altText'
                                                        | 'width'
                                                        | 'height'
                                                      >
                                                    >;
                                                  })
                                                | (Pick<
                                                    StorefrontAPI.Metaobject,
                                                    'id' | 'handle' | 'type'
                                                  > & {
                                                    fields: Array<
                                                      Pick<
                                                        StorefrontAPI.MetaobjectField,
                                                        'key' | 'value'
                                                      > & {
                                                        reference?: StorefrontAPI.Maybe<
                                                          Pick<
                                                            StorefrontAPI.MediaImage,
                                                            'id'
                                                          > & {
                                                            image?: StorefrontAPI.Maybe<
                                                              Pick<
                                                                StorefrontAPI.Image,
                                                                | 'url'
                                                                | 'altText'
                                                                | 'width'
                                                                | 'height'
                                                              >
                                                            >;
                                                          }
                                                        >;
                                                      }
                                                    >;
                                                  })
                                              >;
                                            }>;
                                          }
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      | (Pick<
                                          StorefrontAPI.MediaImage,
                                          'id'
                                        > & {
                                          image?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.Image,
                                              | 'url'
                                              | 'altText'
                                              | 'width'
                                              | 'height'
                                            >
                                          >;
                                        })
                                      | (Pick<
                                          StorefrontAPI.Metaobject,
                                          'id' | 'handle' | 'type'
                                        > & {
                                          fields: Array<
                                            Pick<
                                              StorefrontAPI.MetaobjectField,
                                              'key' | 'value'
                                            > & {
                                              reference?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.MediaImage,
                                                  'id'
                                                > & {
                                                  image?: StorefrontAPI.Maybe<
                                                    Pick<
                                                      StorefrontAPI.Image,
                                                      | 'url'
                                                      | 'altText'
                                                      | 'width'
                                                      | 'height'
                                                    >
                                                  >;
                                                }
                                              >;
                                            }
                                          >;
                                        })
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                      }>;
                    }
                  >;
                })
              | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                  featuredImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
            >;
          }>;
        }
      >;
    }
  >;
  ourBenefitsMetaobject?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
            | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
            | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Metaobject,
                          'id' | 'handle' | 'type'
                        > & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'handle' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value'
                                      > & {
                                        reference?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.MediaImage,
                                            'id'
                                          > & {
                                            image?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.Image,
                                                | 'url'
                                                | 'altText'
                                                | 'width'
                                                | 'height'
                                              >
                                            >;
                                          }
                                        >;
                                      }
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                  | (Pick<
                                      StorefrontAPI.Metaobject,
                                      'id' | 'handle' | 'type'
                                    > & {
                                      fields: Array<
                                        Pick<
                                          StorefrontAPI.MetaobjectField,
                                          'key' | 'value'
                                        > & {
                                          reference?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.MediaImage,
                                              'id'
                                            > & {
                                              image?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.Image,
                                                  | 'url'
                                                  | 'altText'
                                                  | 'width'
                                                  | 'height'
                                                >
                                              >;
                                            }
                                          >;
                                        }
                                      >;
                                    })
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.Metaobject,
                            'id' | 'handle' | 'type'
                          > & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  }
                                >;
                              }
                            >;
                          })
                      >;
                    }>;
                  }
                >;
              })
            | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                featuredImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.Metaobject,
                            'id' | 'handle' | 'type'
                          > & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                  | (Pick<
                                      StorefrontAPI.Metaobject,
                                      'id' | 'handle' | 'type'
                                    > & {
                                      fields: Array<
                                        Pick<
                                          StorefrontAPI.MetaobjectField,
                                          'key' | 'value'
                                        > & {
                                          reference?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.MediaImage,
                                              'id'
                                            > & {
                                              image?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.Image,
                                                  | 'url'
                                                  | 'altText'
                                                  | 'width'
                                                  | 'height'
                                                >
                                              >;
                                            }
                                          >;
                                        }
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'handle' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value'
                                          > & {
                                            reference?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.MediaImage,
                                                'id'
                                              > & {
                                                image?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.Image,
                                                    | 'url'
                                                    | 'altText'
                                                    | 'width'
                                                    | 'height'
                                                  >
                                                >;
                                              }
                                            >;
                                          }
                                        >;
                                      })
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Metaobject,
                              'id' | 'handle' | 'type'
                            > & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'handle' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value'
                                          > & {
                                            reference?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.MediaImage,
                                                'id'
                                              > & {
                                                image?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.Image,
                                                    | 'url'
                                                    | 'altText'
                                                    | 'width'
                                                    | 'height'
                                                  >
                                                >;
                                              }
                                            >;
                                            references?: StorefrontAPI.Maybe<{
                                              nodes: Array<
                                                | (Pick<
                                                    StorefrontAPI.MediaImage,
                                                    'id'
                                                  > & {
                                                    image?: StorefrontAPI.Maybe<
                                                      Pick<
                                                        StorefrontAPI.Image,
                                                        | 'url'
                                                        | 'altText'
                                                        | 'width'
                                                        | 'height'
                                                      >
                                                    >;
                                                  })
                                                | (Pick<
                                                    StorefrontAPI.Metaobject,
                                                    'id' | 'handle' | 'type'
                                                  > & {
                                                    fields: Array<
                                                      Pick<
                                                        StorefrontAPI.MetaobjectField,
                                                        'key' | 'value'
                                                      > & {
                                                        reference?: StorefrontAPI.Maybe<
                                                          Pick<
                                                            StorefrontAPI.MediaImage,
                                                            'id'
                                                          > & {
                                                            image?: StorefrontAPI.Maybe<
                                                              Pick<
                                                                StorefrontAPI.Image,
                                                                | 'url'
                                                                | 'altText'
                                                                | 'width'
                                                                | 'height'
                                                              >
                                                            >;
                                                          }
                                                        >;
                                                      }
                                                    >;
                                                  })
                                              >;
                                            }>;
                                          }
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      | (Pick<
                                          StorefrontAPI.MediaImage,
                                          'id'
                                        > & {
                                          image?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.Image,
                                              | 'url'
                                              | 'altText'
                                              | 'width'
                                              | 'height'
                                            >
                                          >;
                                        })
                                      | (Pick<
                                          StorefrontAPI.Metaobject,
                                          'id' | 'handle' | 'type'
                                        > & {
                                          fields: Array<
                                            Pick<
                                              StorefrontAPI.MetaobjectField,
                                              'key' | 'value'
                                            > & {
                                              reference?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.MediaImage,
                                                  'id'
                                                > & {
                                                  image?: StorefrontAPI.Maybe<
                                                    Pick<
                                                      StorefrontAPI.Image,
                                                      | 'url'
                                                      | 'altText'
                                                      | 'width'
                                                      | 'height'
                                                    >
                                                  >;
                                                }
                                              >;
                                            }
                                          >;
                                        })
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                      }>;
                    }
                  >;
                })
              | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                  featuredImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
            >;
          }>;
        }
      >;
    }
  >;
  festiveEditMetaobject?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
          reference?: StorefrontAPI.Maybe<
            | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
            | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
            | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                fields: Array<
                  Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                    reference?: StorefrontAPI.Maybe<
                      | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                      | (Pick<
                          StorefrontAPI.Metaobject,
                          'id' | 'handle' | 'type'
                        > & {
                          fields: Array<
                            Pick<
                              StorefrontAPI.MetaobjectField,
                              'key' | 'value'
                            > & {
                              reference?: StorefrontAPI.Maybe<
                                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  })
                                | (Pick<
                                    StorefrontAPI.Metaobject,
                                    'id' | 'handle' | 'type'
                                  > & {
                                    fields: Array<
                                      Pick<
                                        StorefrontAPI.MetaobjectField,
                                        'key' | 'value'
                                      > & {
                                        reference?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.MediaImage,
                                            'id'
                                          > & {
                                            image?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.Image,
                                                | 'url'
                                                | 'altText'
                                                | 'width'
                                                | 'height'
                                              >
                                            >;
                                          }
                                        >;
                                      }
                                    >;
                                  })
                              >;
                              references?: StorefrontAPI.Maybe<{
                                nodes: Array<
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                  | (Pick<
                                      StorefrontAPI.Metaobject,
                                      'id' | 'handle' | 'type'
                                    > & {
                                      fields: Array<
                                        Pick<
                                          StorefrontAPI.MetaobjectField,
                                          'key' | 'value'
                                        > & {
                                          reference?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.MediaImage,
                                              'id'
                                            > & {
                                              image?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.Image,
                                                  | 'url'
                                                  | 'altText'
                                                  | 'width'
                                                  | 'height'
                                                >
                                              >;
                                            }
                                          >;
                                        }
                                      >;
                                    })
                                >;
                              }>;
                            }
                          >;
                        })
                    >;
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.Metaobject,
                            'id' | 'handle' | 'type'
                          > & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  Pick<StorefrontAPI.MediaImage, 'id'> & {
                                    image?: StorefrontAPI.Maybe<
                                      Pick<
                                        StorefrontAPI.Image,
                                        'url' | 'altText' | 'width' | 'height'
                                      >
                                    >;
                                  }
                                >;
                              }
                            >;
                          })
                      >;
                    }>;
                  }
                >;
              })
            | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                featuredImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
          >;
          references?: StorefrontAPI.Maybe<{
            nodes: Array<
              | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | Pick<
                            StorefrontAPI.Collection,
                            'id' | 'handle' | 'title'
                          >
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.Metaobject,
                            'id' | 'handle' | 'type'
                          > & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                  | (Pick<
                                      StorefrontAPI.Metaobject,
                                      'id' | 'handle' | 'type'
                                    > & {
                                      fields: Array<
                                        Pick<
                                          StorefrontAPI.MetaobjectField,
                                          'key' | 'value'
                                        > & {
                                          reference?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.MediaImage,
                                              'id'
                                            > & {
                                              image?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.Image,
                                                  | 'url'
                                                  | 'altText'
                                                  | 'width'
                                                  | 'height'
                                                >
                                              >;
                                            }
                                          >;
                                        }
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'handle' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value'
                                          > & {
                                            reference?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.MediaImage,
                                                'id'
                                              > & {
                                                image?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.Image,
                                                    | 'url'
                                                    | 'altText'
                                                    | 'width'
                                                    | 'height'
                                                  >
                                                >;
                                              }
                                            >;
                                          }
                                        >;
                                      })
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Metaobject,
                              'id' | 'handle' | 'type'
                            > & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'handle' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value'
                                          > & {
                                            reference?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.MediaImage,
                                                'id'
                                              > & {
                                                image?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.Image,
                                                    | 'url'
                                                    | 'altText'
                                                    | 'width'
                                                    | 'height'
                                                  >
                                                >;
                                              }
                                            >;
                                            references?: StorefrontAPI.Maybe<{
                                              nodes: Array<
                                                | (Pick<
                                                    StorefrontAPI.MediaImage,
                                                    'id'
                                                  > & {
                                                    image?: StorefrontAPI.Maybe<
                                                      Pick<
                                                        StorefrontAPI.Image,
                                                        | 'url'
                                                        | 'altText'
                                                        | 'width'
                                                        | 'height'
                                                      >
                                                    >;
                                                  })
                                                | (Pick<
                                                    StorefrontAPI.Metaobject,
                                                    'id' | 'handle' | 'type'
                                                  > & {
                                                    fields: Array<
                                                      Pick<
                                                        StorefrontAPI.MetaobjectField,
                                                        'key' | 'value'
                                                      > & {
                                                        reference?: StorefrontAPI.Maybe<
                                                          Pick<
                                                            StorefrontAPI.MediaImage,
                                                            'id'
                                                          > & {
                                                            image?: StorefrontAPI.Maybe<
                                                              Pick<
                                                                StorefrontAPI.Image,
                                                                | 'url'
                                                                | 'altText'
                                                                | 'width'
                                                                | 'height'
                                                              >
                                                            >;
                                                          }
                                                        >;
                                                      }
                                                    >;
                                                  })
                                              >;
                                            }>;
                                          }
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      | (Pick<
                                          StorefrontAPI.MediaImage,
                                          'id'
                                        > & {
                                          image?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.Image,
                                              | 'url'
                                              | 'altText'
                                              | 'width'
                                              | 'height'
                                            >
                                          >;
                                        })
                                      | (Pick<
                                          StorefrontAPI.Metaobject,
                                          'id' | 'handle' | 'type'
                                        > & {
                                          fields: Array<
                                            Pick<
                                              StorefrontAPI.MetaobjectField,
                                              'key' | 'value'
                                            > & {
                                              reference?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.MediaImage,
                                                  'id'
                                                > & {
                                                  image?: StorefrontAPI.Maybe<
                                                    Pick<
                                                      StorefrontAPI.Image,
                                                      | 'url'
                                                      | 'altText'
                                                      | 'width'
                                                      | 'height'
                                                    >
                                                  >;
                                                }
                                              >;
                                            }
                                          >;
                                        })
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                      }>;
                    }
                  >;
                })
              | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                  featuredImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
            >;
          }>;
        }
      >;
    }
  >;
  homePageMetaobjects: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
            reference?: StorefrontAPI.Maybe<
              | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                  fields: Array<
                    Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                      reference?: StorefrontAPI.Maybe<
                        | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                        | (Pick<
                            StorefrontAPI.Metaobject,
                            'id' | 'handle' | 'type'
                          > & {
                            fields: Array<
                              Pick<
                                StorefrontAPI.MetaobjectField,
                                'key' | 'value'
                              > & {
                                reference?: StorefrontAPI.Maybe<
                                  | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    })
                                  | (Pick<
                                      StorefrontAPI.Metaobject,
                                      'id' | 'handle' | 'type'
                                    > & {
                                      fields: Array<
                                        Pick<
                                          StorefrontAPI.MetaobjectField,
                                          'key' | 'value'
                                        > & {
                                          reference?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.MediaImage,
                                              'id'
                                            > & {
                                              image?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.Image,
                                                  | 'url'
                                                  | 'altText'
                                                  | 'width'
                                                  | 'height'
                                                >
                                              >;
                                            }
                                          >;
                                        }
                                      >;
                                    })
                                >;
                                references?: StorefrontAPI.Maybe<{
                                  nodes: Array<
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'handle' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value'
                                          > & {
                                            reference?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.MediaImage,
                                                'id'
                                              > & {
                                                image?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.Image,
                                                    | 'url'
                                                    | 'altText'
                                                    | 'width'
                                                    | 'height'
                                                  >
                                                >;
                                              }
                                            >;
                                          }
                                        >;
                                      })
                                  >;
                                }>;
                              }
                            >;
                          })
                      >;
                      references?: StorefrontAPI.Maybe<{
                        nodes: Array<
                          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Metaobject,
                              'id' | 'handle' | 'type'
                            > & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    Pick<StorefrontAPI.MediaImage, 'id'> & {
                                      image?: StorefrontAPI.Maybe<
                                        Pick<
                                          StorefrontAPI.Image,
                                          'url' | 'altText' | 'width' | 'height'
                                        >
                                      >;
                                    }
                                  >;
                                }
                              >;
                            })
                        >;
                      }>;
                    }
                  >;
                })
              | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                  featuredImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
            >;
            references?: StorefrontAPI.Maybe<{
              nodes: Array<
                | (Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  })
                | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  })
                | (Pick<StorefrontAPI.Metaobject, 'id' | 'handle' | 'type'> & {
                    fields: Array<
                      Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
                        reference?: StorefrontAPI.Maybe<
                          | Pick<
                              StorefrontAPI.Collection,
                              'id' | 'handle' | 'title'
                            >
                          | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                              image?: StorefrontAPI.Maybe<
                                Pick<
                                  StorefrontAPI.Image,
                                  'url' | 'altText' | 'width' | 'height'
                                >
                              >;
                            })
                          | (Pick<
                              StorefrontAPI.Metaobject,
                              'id' | 'handle' | 'type'
                            > & {
                              fields: Array<
                                Pick<
                                  StorefrontAPI.MetaobjectField,
                                  'key' | 'value'
                                > & {
                                  reference?: StorefrontAPI.Maybe<
                                    | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                        image?: StorefrontAPI.Maybe<
                                          Pick<
                                            StorefrontAPI.Image,
                                            | 'url'
                                            | 'altText'
                                            | 'width'
                                            | 'height'
                                          >
                                        >;
                                      })
                                    | (Pick<
                                        StorefrontAPI.Metaobject,
                                        'id' | 'handle' | 'type'
                                      > & {
                                        fields: Array<
                                          Pick<
                                            StorefrontAPI.MetaobjectField,
                                            'key' | 'value'
                                          > & {
                                            reference?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.MediaImage,
                                                'id'
                                              > & {
                                                image?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.Image,
                                                    | 'url'
                                                    | 'altText'
                                                    | 'width'
                                                    | 'height'
                                                  >
                                                >;
                                              }
                                            >;
                                          }
                                        >;
                                      })
                                  >;
                                  references?: StorefrontAPI.Maybe<{
                                    nodes: Array<
                                      | (Pick<
                                          StorefrontAPI.MediaImage,
                                          'id'
                                        > & {
                                          image?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.Image,
                                              | 'url'
                                              | 'altText'
                                              | 'width'
                                              | 'height'
                                            >
                                          >;
                                        })
                                      | (Pick<
                                          StorefrontAPI.Metaobject,
                                          'id' | 'handle' | 'type'
                                        > & {
                                          fields: Array<
                                            Pick<
                                              StorefrontAPI.MetaobjectField,
                                              'key' | 'value'
                                            > & {
                                              reference?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.MediaImage,
                                                  'id'
                                                > & {
                                                  image?: StorefrontAPI.Maybe<
                                                    Pick<
                                                      StorefrontAPI.Image,
                                                      | 'url'
                                                      | 'altText'
                                                      | 'width'
                                                      | 'height'
                                                    >
                                                  >;
                                                }
                                              >;
                                            }
                                          >;
                                        })
                                    >;
                                  }>;
                                }
                              >;
                            })
                        >;
                        references?: StorefrontAPI.Maybe<{
                          nodes: Array<
                            | (Pick<StorefrontAPI.MediaImage, 'id'> & {
                                image?: StorefrontAPI.Maybe<
                                  Pick<
                                    StorefrontAPI.Image,
                                    'url' | 'altText' | 'width' | 'height'
                                  >
                                >;
                              })
                            | (Pick<
                                StorefrontAPI.Metaobject,
                                'id' | 'handle' | 'type'
                              > & {
                                fields: Array<
                                  Pick<
                                    StorefrontAPI.MetaobjectField,
                                    'key' | 'value'
                                  > & {
                                    reference?: StorefrontAPI.Maybe<
                                      | (Pick<
                                          StorefrontAPI.MediaImage,
                                          'id'
                                        > & {
                                          image?: StorefrontAPI.Maybe<
                                            Pick<
                                              StorefrontAPI.Image,
                                              | 'url'
                                              | 'altText'
                                              | 'width'
                                              | 'height'
                                            >
                                          >;
                                        })
                                      | (Pick<
                                          StorefrontAPI.Metaobject,
                                          'id' | 'handle' | 'type'
                                        > & {
                                          fields: Array<
                                            Pick<
                                              StorefrontAPI.MetaobjectField,
                                              'key' | 'value'
                                            > & {
                                              reference?: StorefrontAPI.Maybe<
                                                Pick<
                                                  StorefrontAPI.MediaImage,
                                                  'id'
                                                > & {
                                                  image?: StorefrontAPI.Maybe<
                                                    Pick<
                                                      StorefrontAPI.Image,
                                                      | 'url'
                                                      | 'altText'
                                                      | 'width'
                                                      | 'height'
                                                    >
                                                  >;
                                                }
                                              >;
                                              references?: StorefrontAPI.Maybe<{
                                                nodes: Array<
                                                  | (Pick<
                                                      StorefrontAPI.MediaImage,
                                                      'id'
                                                    > & {
                                                      image?: StorefrontAPI.Maybe<
                                                        Pick<
                                                          StorefrontAPI.Image,
                                                          | 'url'
                                                          | 'altText'
                                                          | 'width'
                                                          | 'height'
                                                        >
                                                      >;
                                                    })
                                                  | (Pick<
                                                      StorefrontAPI.Metaobject,
                                                      'id' | 'handle' | 'type'
                                                    > & {
                                                      fields: Array<
                                                        Pick<
                                                          StorefrontAPI.MetaobjectField,
                                                          'key' | 'value'
                                                        > & {
                                                          reference?: StorefrontAPI.Maybe<
                                                            Pick<
                                                              StorefrontAPI.MediaImage,
                                                              'id'
                                                            > & {
                                                              image?: StorefrontAPI.Maybe<
                                                                Pick<
                                                                  StorefrontAPI.Image,
                                                                  | 'url'
                                                                  | 'altText'
                                                                  | 'width'
                                                                  | 'height'
                                                                >
                                                              >;
                                                            }
                                                          >;
                                                        }
                                                      >;
                                                    })
                                                >;
                                              }>;
                                            }
                                          >;
                                        })
                                    >;
                                    references?: StorefrontAPI.Maybe<{
                                      nodes: Array<
                                        | (Pick<
                                            StorefrontAPI.MediaImage,
                                            'id'
                                          > & {
                                            image?: StorefrontAPI.Maybe<
                                              Pick<
                                                StorefrontAPI.Image,
                                                | 'url'
                                                | 'altText'
                                                | 'width'
                                                | 'height'
                                              >
                                            >;
                                          })
                                        | (Pick<
                                            StorefrontAPI.Metaobject,
                                            'id' | 'handle' | 'type'
                                          > & {
                                            fields: Array<
                                              Pick<
                                                StorefrontAPI.MetaobjectField,
                                                'key' | 'value'
                                              > & {
                                                reference?: StorefrontAPI.Maybe<
                                                  Pick<
                                                    StorefrontAPI.MediaImage,
                                                    'id'
                                                  > & {
                                                    image?: StorefrontAPI.Maybe<
                                                      Pick<
                                                        StorefrontAPI.Image,
                                                        | 'url'
                                                        | 'altText'
                                                        | 'width'
                                                        | 'height'
                                                      >
                                                    >;
                                                  }
                                                >;
                                              }
                                            >;
                                          })
                                      >;
                                    }>;
                                  }
                                >;
                              })
                          >;
                        }>;
                      }
                    >;
                  })
                | (Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
                    featuredImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  })
              >;
            }>;
          }
        >;
      }
    >;
  };
};

export type StorefrontCustomerOrderQueryVariables = StorefrontAPI.Exact<{
  orderId: StorefrontAPI.Scalars['ID']['input'];
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
}>;

export type StorefrontCustomerOrderQuery = {
  customer?: StorefrontAPI.Maybe<{
    orders: {nodes: Array<Pick<StorefrontAPI.Order, 'id'>>};
  }>;
  order?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Order,
      'id' | 'name' | 'processedAt' | 'statusUrl' | 'fulfillmentStatus'
    > & {
      subtotalPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalTax?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      shippingAddress?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.MailingAddress,
          'name' | 'formatted' | 'formattedArea'
        >
      >;
      discountApplications: {
        nodes: Array<{
          value:
            | ({__typename: 'MoneyV2'} & Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >)
            | ({__typename: 'PricingPercentageValue'} & Pick<
                StorefrontAPI.PricingPercentageValue,
                'percentage'
              >);
        }>;
      };
      lineItems: {
        nodes: Array<
          Pick<StorefrontAPI.OrderLineItem, 'title' | 'quantity'> & {
            originalTotalPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            discountedTotalPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            variant?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              }
            >;
          }
        >;
      };
    }
  >;
};

export type GetCustomerOrdersQueryVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
}>;

export type GetCustomerOrdersQuery = {
  customer?: StorefrontAPI.Maybe<{
    orders: {
      nodes: Array<
        Pick<
          StorefrontAPI.Order,
          | 'id'
          | 'name'
          | 'orderNumber'
          | 'processedAt'
          | 'financialStatus'
          | 'fulfillmentStatus'
        > & {totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>}
      >;
      pageInfo: Pick<
        StorefrontAPI.PageInfo,
        'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
      >;
    };
  }>;
};

export type LocationPickerAddressesQueryVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
}>;

export type LocationPickerAddressesQuery = {
  customer?: StorefrontAPI.Maybe<{
    addresses: {
      nodes: Array<
        Pick<
          StorefrontAPI.MailingAddress,
          'id' | 'firstName' | 'lastName' | 'address1' | 'city' | 'zip'
        >
      >;
    };
  }>;
};

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  query: StorefrontAPI.Scalars['String']['input'];
  limit?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    queries: Array<Pick<StorefrontAPI.SearchQuerySuggestion, 'text'>>;
    products: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
      }
    >;
    collections: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
      }
    >;
  }>;
};

export type FavouriteProductVariantsQueryVariables = StorefrontAPI.Exact<{
  ids:
    | Array<StorefrontAPI.Scalars['ID']['input']>
    | StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FavouriteProductVariantsQuery = {
  nodes: Array<
    StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Product, 'id'> & {
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>}
          >;
        };
      }
    >
  >;
};

export type ArticleQueryVariables = StorefrontAPI.Exact<{
  articleHandle: StorefrontAPI.Scalars['String']['input'];
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ArticleQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'handle'> & {
      articleByHandle?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.Article,
          'handle' | 'title' | 'contentHtml' | 'publishedAt'
        > & {
          author?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ArticleAuthor, 'name'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
          seo?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Seo, 'description' | 'title'>
          >;
        }
      >;
    }
  >;
};

export type BlogQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'title' | 'description'>
      >;
      articles: {
        nodes: Array<
          Pick<
            StorefrontAPI.Article,
            'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
          > & {
            author?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ArticleAuthor, 'name'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            blog: Pick<StorefrontAPI.Blog, 'handle'>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type ArticleItemFragment = Pick<
  StorefrontAPI.Article,
  'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
> & {
  author?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  blog: Pick<StorefrontAPI.Blog, 'handle'>;
};

export type BlogsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogsQuery = {
  blogs: {
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
    nodes: Array<
      Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'title' | 'description'>
        >;
      }
    >;
  };
};

export type CartPageOfferBannerMetaobjectQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type CartPageOfferBannerMetaobjectQuery = {
  metaobjects: {
    nodes: Array<{
      fields: Array<
        Pick<StorefrontAPI.MetaobjectField, 'key'> & {
          reference?: StorefrontAPI.Maybe<{
            image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
          }>;
        }
      >;
    }>;
  };
};

export type CartRecommendedProductsQueryVariables = StorefrontAPI.Exact<{
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type CartRecommendedProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'vendor'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>}
          >;
        };
      }
    >;
  };
};

export type CartProductRecommendationsQueryVariables = StorefrontAPI.Exact<{
  productId: StorefrontAPI.Scalars['ID']['input'];
}>;

export type CartProductRecommendationsQuery = {
  productRecommendations?: StorefrontAPI.Maybe<
    Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'handle'
        | 'vendor'
        | 'productType'
        | 'availableForSale'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
            }
          >;
        };
      }
    >
  >;
};

export type GetCollectionProductsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  first: StorefrontAPI.Scalars['Int']['input'];
  after?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductCollectionSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type GetCollectionProductsQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      seo: Pick<StorefrontAPI.Seo, 'title' | 'description'>;
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      standardCategoryBanner?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'type'> & {
          reference?: StorefrontAPI.Maybe<{
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          }>;
        }
      >;
      products: {
        filters: Array<
          Pick<
            StorefrontAPI.Filter,
            'id' | 'label' | 'type' | 'presentation'
          > & {
            values: Array<
              Pick<
                StorefrontAPI.FilterValue,
                'id' | 'label' | 'count' | 'input'
              > & {
                swatch?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Swatch, 'color'> & {
                    image?: StorefrontAPI.Maybe<{
                      previewImage?: StorefrontAPI.Maybe<
                        Pick<StorefrontAPI.Image, 'url'>
                      >;
                    }>;
                  }
                >;
              }
            >;
          }
        >;
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'handle'
            | 'title'
            | 'description'
            | 'availableForSale'
            | 'vendor'
            | 'productType'
            | 'tags'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'altText' | 'url' | 'width' | 'height'
                >
              >;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'title' | 'sku' | 'availableForSale'
                > & {
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }
              >;
            };
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
        >;
      };
    }
  >;
};

export type CollectionFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type StoreCollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type StoreCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type MoneyCollectionItemFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type CollectionItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title' | 'vendor' | 'productType' | 'tags'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  images: {
    nodes: Array<
      Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
    >;
  };
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  compareAtPriceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type CatalogQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CatalogQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'productType' | 'tags'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        images: {
          nodes: Array<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
        };
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
  search: {
    productFilters: Array<
      Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type' | 'presentation'> & {
        values: Array<
          Pick<
            StorefrontAPI.FilterValue,
            'id' | 'label' | 'count' | 'input'
          > & {
            swatch?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Swatch, 'color'> & {
                image?: StorefrontAPI.Maybe<{
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Image, 'url'>
                  >;
                }>;
              }
            >;
          }
        >;
      }
    >;
  };
};

export type SearchCatalogQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  searchTerm: StorefrontAPI.Scalars['String']['input'];
  productFilters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
}>;

export type SearchCatalogQuery = {
  search: Pick<StorefrontAPI.SearchResultItemConnection, 'totalCount'> & {
    productFilters: Array<
      Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type' | 'presentation'> & {
        values: Array<
          Pick<
            StorefrontAPI.FilterValue,
            'id' | 'label' | 'count' | 'input'
          > & {
            swatch?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Swatch, 'color'> & {
                image?: StorefrontAPI.Maybe<{
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Image, 'url'>
                  >;
                }>;
              }
            >;
          }
        >;
      }
    >;
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'id' | 'handle' | 'title' | 'vendor' | 'productType' | 'tags'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        images: {
          nodes: Array<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
        };
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'handle' | 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
      metafields: Array<
        StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Metafield,
            'key' | 'namespace' | 'value' | 'type'
          > & {
            reference?: StorefrontAPI.Maybe<{
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
            }>;
          }
        >
      >;
    }
  >;
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  privacyPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  refundPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  shippingPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  termsOfService: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type PolicyQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
  };
};

export type PolicyItemFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'id' | 'title' | 'handle'
>;

export type PoliciesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'id' | 'title' | 'handle'>
    >;
  };
};

export type SearchProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  | 'handle'
  | 'id'
  | 'publishedAt'
  | 'title'
  | 'trackingParameters'
  | 'vendor'
  | 'productType'
  | 'tags'
> & {
    featuredImage?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
    >;
    images: {
      nodes: Array<
        Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
      >;
    };
    priceRange: {
      minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    };
    compareAtPriceRange: {
      minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    };
    selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'title' | 'availableForSale'
      > & {
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
      }
    >;
    variants: {
      nodes: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'title' | 'sku' | 'availableForSale'
        > & {
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
      >;
    };
  };

export type SearchPageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type SearchArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type PageInfoFragmentFragment = Pick<
  StorefrontAPI.PageInfo,
  'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
>;

export type RegularSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  term: StorefrontAPI.Scalars['String']['input'];
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  productFilters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.SearchSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
}>;

export type RegularSearchQuery = {
  articles: {
    nodes: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
  pages: {
    nodes: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
  products: {
    productFilters: Array<
      Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type' | 'presentation'> & {
        values: Array<
          Pick<
            StorefrontAPI.FilterValue,
            'id' | 'label' | 'count' | 'input'
          > & {
            swatch?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Swatch, 'color'> & {
                image?: StorefrontAPI.Maybe<{
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Image, 'url'>
                  >;
                }>;
              }
            >;
          }
        >;
      }
    >;
    nodes: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        | 'handle'
        | 'id'
        | 'publishedAt'
        | 'title'
        | 'trackingParameters'
        | 'vendor'
        | 'productType'
        | 'tags'
      > & {
          featuredImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
          images: {
            nodes: Array<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
          };
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            maxVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          compareAtPriceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            maxVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
            }
          >;
          variants: {
            nodes: Array<
              Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'title' | 'sku' | 'availableForSale'
              > & {
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
              }
            >;
          };
        }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

interface GeneratedQueryTypes {
  '#graphql\n  #graphql\n  fragment BabyShopMediaImage on MediaImage {\n    id\n    image {\n      url\n      altText\n      width\n      height\n    }\n  }\n\n  fragment BabyShopCardItem on Metaobject {\n    id\n    handle\n    fields {\n      key\n      value\n      reference {\n        ...BabyShopMediaImage\n        ... on Collection {\n          id\n          handle\n          title\n        }\n      }\n      references(first: 10) {\n        nodes {\n          ... on Collection {\n            id\n            handle\n            title\n          }\n        }\n      }\n    }\n  }\n\n  fragment BabyShopBannerItem on Metaobject {\n    id\n    handle\n    fields {\n      key\n      value\n      reference {\n        ...BabyShopMediaImage\n        ... on Collection {\n          id\n          handle\n          title\n        }\n      }\n      references(first: 10) {\n        nodes {\n          ... on Collection {\n            id\n            handle\n            title\n          }\n        }\n      }\n    }\n  }\n\n  fragment BabyShopDataNode on Metaobject {\n    id\n    handle\n    fields {\n      key\n      value\n      reference {\n        ...BabyShopBannerItem\n        ...BabyShopMediaImage\n      }\n      references(first: 20) {\n        nodes {\n          ... on Metaobject {\n            ...BabyShopCardItem\n          }\n        }\n      }\n    }\n  }\n\n  fragment BabyShopMetaobject on Metaobject {\n    id\n    handle\n    fields {\n      key\n      value\n      reference {\n        ... on Metaobject {\n          id\n          fields {\n            key\n            value\n          }\n        }\n      }\n      references(first: 2) {\n        nodes {\n          ... on Metaobject {\n            ...BabyShopDataNode\n          }\n        }\n      }\n    }\n  }\n\n  query HomePageBabyShop($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    babyShopMetaobject: metaobject(handle: {handle: "babyshop", type: "home_page"}) {\n      ...BabyShopMetaobject\n    }\n    babyShopDataMetaobjects: metaobjects(type: "babyshop_data", first: 1) {\n      nodes {\n        ...BabyShopDataNode\n      }\n    }\n  }\n': {
    return: HomePageBabyShopQuery;
    variables: HomePageBabyShopQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ShowcaseMediaImage on MediaImage {\n    id\n    image {\n      url\n      altText\n      width\n      height\n    }\n  }\n\n  fragment ShowcaseBannerItem on Metaobject {\n    id\n    handle\n    fields {\n      key\n      value\n      reference {\n        ...ShowcaseMediaImage\n        ... on Collection {\n          id\n          handle\n          title\n        }\n      }\n      references(first: 10) {\n        nodes {\n          ... on Collection {\n            id\n            handle\n            title\n          }\n        }\n      }\n    }\n  }\n\n  fragment ShowcaseCardItem on Metaobject {\n    id\n    handle\n    fields {\n      key\n      value\n      reference {\n        ...ShowcaseMediaImage\n        ... on Collection {\n          id\n          handle\n          title\n        }\n      }\n      references(first: 10) {\n        nodes {\n          ... on Collection {\n            id\n            handle\n            title\n          }\n        }\n      }\n    }\n  }\n\n  fragment ShowcaseDataNode on Metaobject {\n    id\n    handle\n    type\n    fields {\n      key\n      value\n      reference {\n        ...ShowcaseBannerItem\n        ...ShowcaseMediaImage\n        ... on Collection {\n          id\n          handle\n          title\n        }\n      }\n      references(first: 100) {\n        nodes {\n          ... on Metaobject {\n            ...ShowcaseCardItem\n          }\n          ... on Collection {\n            id\n            handle\n            title\n          }\n        }\n      }\n    }\n  }\n\n  fragment ShowcaseSectionMetaobject on Metaobject {\n    id\n    handle\n    type\n    fields {\n      key\n      value\n      reference {\n        ... on Metaobject {\n          id\n          handle\n          type\n          fields {\n            key\n            value\n            reference {\n              ...ShowcaseBannerItem\n              ...ShowcaseMediaImage\n              ... on Collection {\n                id\n                handle\n                title\n              }\n            }\n            references(first: 100) {\n              nodes {\n                ... on Metaobject {\n                  ...ShowcaseCardItem\n                }\n                ... on Collection {\n                  id\n                  handle\n                  title\n                }\n              }\n            }\n          }\n        }\n        ... on Collection {\n          id\n          handle\n          title\n        }\n      }\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            ...ShowcaseDataNode\n          }\n          ... on Collection {\n            id\n            handle\n            title\n          }\n        }\n      }\n    }\n  }\n\n  query HomePageSections($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    homePageSections: metaobjects(type: "home_page", first: 20) {\n      nodes {\n        ...ShowcaseSectionMetaobject\n      }\n    }\n  }\n': {
    return: HomePageSectionsQuery;
    variables: HomePageSectionsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ShowcaseMediaImage on MediaImage {\n    id\n    image {\n      url\n      altText\n      width\n      height\n    }\n  }\n\n  fragment ShowcaseBannerItem on Metaobject {\n    id\n    handle\n    fields {\n      key\n      value\n      reference {\n        ...ShowcaseMediaImage\n        ... on Collection {\n          id\n          handle\n          title\n        }\n      }\n      references(first: 10) {\n        nodes {\n          ... on Collection {\n            id\n            handle\n            title\n          }\n        }\n      }\n    }\n  }\n\n  fragment ShowcaseCardItem on Metaobject {\n    id\n    handle\n    fields {\n      key\n      value\n      reference {\n        ...ShowcaseMediaImage\n        ... on Collection {\n          id\n          handle\n          title\n        }\n      }\n      references(first: 10) {\n        nodes {\n          ... on Collection {\n            id\n            handle\n            title\n          }\n        }\n      }\n    }\n  }\n\n  fragment ShowcaseDataNode on Metaobject {\n    id\n    handle\n    type\n    fields {\n      key\n      value\n      reference {\n        ...ShowcaseBannerItem\n        ...ShowcaseMediaImage\n        ... on Collection {\n          id\n          handle\n          title\n        }\n      }\n      references(first: 100) {\n        nodes {\n          ... on Metaobject {\n            ...ShowcaseCardItem\n          }\n          ... on Collection {\n            id\n            handle\n            title\n          }\n        }\n      }\n    }\n  }\n\n  fragment ShowcaseSectionMetaobject on Metaobject {\n    id\n    handle\n    type\n    fields {\n      key\n      value\n      reference {\n        ... on Metaobject {\n          id\n          handle\n          type\n          fields {\n            key\n            value\n            reference {\n              ...ShowcaseBannerItem\n              ...ShowcaseMediaImage\n              ... on Collection {\n                id\n                handle\n                title\n              }\n            }\n            references(first: 100) {\n              nodes {\n                ... on Metaobject {\n                  ...ShowcaseCardItem\n                }\n                ... on Collection {\n                  id\n                  handle\n                  title\n                }\n              }\n            }\n          }\n        }\n        ... on Collection {\n          id\n          handle\n          title\n        }\n      }\n      references(first: 10) {\n        nodes {\n          ... on Metaobject {\n            ...ShowcaseDataNode\n          }\n          ... on Collection {\n            id\n            handle\n            title\n          }\n        }\n      }\n    }\n  }\n\n  query HomePageShowcaseSections($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    bestsellers: metaobject(handle: {handle: "bestseller", type: "home_page"}) {\n      ...ShowcaseSectionMetaobject\n    }\n    topBrands: metaobject(handle: {handle: "top-brands-on-lifestyle-collections", type: "home_page"}) {\n      ...ShowcaseSectionMetaobject\n    }\n    festiveEdit: metaobject(handle: {handle: "festive-edit", type: "home_page"}) {\n      ...ShowcaseSectionMetaobject\n    }\n    homeLiving: metaobject(handle: {handle: "all-new-home-living-store", type: "home_page"}) {\n      ...ShowcaseSectionMetaobject\n    }\n    babyShop: metaobject(handle: {handle: "babyshop", type: "home_page"}) {\n      ...ShowcaseSectionMetaobject\n    }\n  }\n': {
    return: HomePageShowcaseSectionsQuery;
    variables: HomePageShowcaseSectionsQueryVariables;
  };
  '#graphql\n  fragment DepartmentImage on MediaImage {\n    image {\n      url\n      altText\n      width\n      height\n    }\n  }\n\n  fragment DepartmentLeafField on MetaobjectField {\n    key\n    value\n    reference {\n      __typename\n      ... on MediaImage {\n        ...DepartmentImage\n      }\n      ... on Collection {\n        handle\n      }\n    }\n  }\n\n  fragment DepartmentEntry on Metaobject {\n    id\n    handle\n    type\n    fields {\n      key\n      value\n      references(first: 20) {\n        nodes {\n          ... on Metaobject {\n            id\n            handle\n            type\n            fields {\n              key\n              value\n              reference {\n                __typename\n                ... on MediaImage {\n                  ...DepartmentImage\n                }\n                ... on Collection {\n                  handle\n                }\n              }\n              references(first: 30) {\n                nodes {\n                  ... on Metaobject {\n                    id\n                    handle\n                    type\n                    fields {\n                      ...DepartmentLeafField\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n\n  query DepartmentMetaobjects(\n    $type: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    departmentMetaobjects: metaobjects(type: $type, first: 50) {\n      nodes {\n        ...DepartmentEntry\n      }\n    }\n  }\n': {
    return: DepartmentMetaobjectsQuery;
    variables: DepartmentMetaobjectsQueryVariables;
  };
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  fragment AnnouncementBarMetaobject on Metaobject {\n    id\n    handle\n    type\n    fields {\n      key\n      value\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n            altText\n          }\n        }\n        ... on Collection {\n          id\n          handle\n          title\n        }\n        ... on Product {\n          id\n          handle\n          title\n        }\n        ... on Page {\n          id\n          handle\n          title\n        }\n      }\n    }\n  }\n  query Header(\n    $country: CountryCode\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n    topBar: metaobject(handle: {type: "top_bar_link_main", handle: "top-bar-link-main"}) {\n      fields {\n        key\n        value\n        references(first: 10) {\n          nodes {\n            ... on Metaobject {\n              fields {\n                key\n                value\n                reference {\n                  ... on MediaImage {\n                    image {\n                      url\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    announcementBarMetaobject: metaobject(handle: {handle: "announcement-bar-1", type: "announcement_bar"}) {\n      ...AnnouncementBarMetaobject\n    }\n    announcementBarMetaobjects: metaobjects(type: "announcement_bar", first: 10) {\n      nodes {\n        ...AnnouncementBarMetaobject\n      }\n    }\n    mobileHeroCategories: metaobject(handle: {handle: "department-list", type: "home_page"}) {\n      id\n      handle\n      type\n      fields {\n        key\n        value\n        reference {\n          ... on Metaobject {\n            id\n            handle\n            fields {\n              key\n              value\n              reference {\n                ... on MediaImage {\n                  image {\n                    url\n                    altText\n                    width\n                    height\n                  }\n                }\n                ... on Collection {\n                  id\n                  handle\n                  title\n                }\n              }\n              references(first: 20) {\n                nodes {\n                  ... on Collection {\n                    id\n                    handle\n                    title\n                  }\n                }\n              }\n            }\n          }\n        }\n        references(first: 50) {\n          nodes {\n            ... on Metaobject {\n              id\n              handle\n              fields {\n                key\n                value\n                reference {\n                  ... on MediaImage {\n                    image {\n                      url\n                      altText\n                      width\n                      height\n                    }\n                  }\n                  ... on Collection {\n                    id\n                    handle\n                    title\n                  }\n                }\n                references(first: 20) {\n                  nodes {\n                    ... on Collection {\n                      id\n                      handle\n                      title\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment GrandChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...GrandChildMenuItem\n    }\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Footer(\n    $country: CountryCode\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n    moreMenu: menu(handle: "more") {\n      ...Menu\n    }\n    helpMenu: menu(handle: "help") {\n      ...Menu\n    }\n    footerWomen: menu(handle: "footer-women") { ...Menu }\n    footerMen: menu(handle: "footer-men") { ...Menu }\n    footerKids: menu(handle: "footer-kids") { ...Menu }\n    footerHomeLiving: menu(handle: "footer-home-living") { ...Menu }\n    footerFootwear: menu(handle: "footer-footwear") { ...Menu }\n    footerBeauty: menu(handle: "footer-beauty") { ...Menu }\n    footerBags: menu(handle: "footer-bags") { ...Menu }\n    footerBabyshop: menu(handle: "footer-babyshop") { ...Menu }\n    metaobjects(type: "footer_main", first: 1) {\n      nodes {\n        fields {\n          key\n          value\n          reference {\n            ... on Metaobject {\n              fields {\n                key\n                value\n                reference {\n                  ... on MediaImage {\n                    image {\n                      url\n                      altText\n                    }\n                  }\n                }\n                references(first: 10) {\n                  nodes {\n                    ... on Metaobject {\n                      fields {\n                        key\n                        value\n                        reference {\n                          ... on MediaImage {\n                            image {\n                              url\n                              altText\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n            ... on MediaImage {\n              image {\n                url\n                altText\n              }\n            }\n          }\n          references(first: 10) {\n            nodes {\n              ... on Metaobject {\n                fields {\n                  key\n                  value\n                  reference {\n                    ... on MediaImage {\n                      image {\n                        url\n                        altText\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment GrandChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...GrandChildMenuItem\n    }\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n    query MainHeaderMetaobject {\n      metaobject(handle: {type: "main_header", handle: "main-header-azyeqhek"}) {\n        fields {\n          key\n          value\n          reference {\n            ... on Metaobject {\n              fields {\n                key\n                value\n              }\n            }\n            ... on MediaImage {\n              image {\n                url\n              }\n            }\n          }\n        }\n      }\n    }\n  ': {
    return: MainHeaderMetaobjectQuery;
    variables: MainHeaderMetaobjectQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment HeroSliderSlideFields on Metaobject {\n    id\n    handle\n    type\n    fields {\n      key\n      value\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n            altText\n            width\n            height\n          }\n        }\n        ... on Collection {\n          id\n          handle\n          title\n        }\n        ... on Metaobject {\n          id\n          handle\n          type\n          fields {\n            key\n            value\n            reference {\n              ... on MediaImage {\n                id\n                image {\n                  url\n                  altText\n                  width\n                  height\n                }\n              }\n              ... on Metaobject {\n                id\n                handle\n                type\n                fields {\n                  key\n                  value\n                  reference {\n                    ... on MediaImage {\n                      id\n                      image {\n                        url\n                        altText\n                        width\n                        height\n                      }\n                    }\n                  }\n                }\n              }\n            }\n            references(first: 20) {\n              nodes {\n                ... on Metaobject {\n                  id\n                  handle\n                  type\n                  fields {\n                    key\n                    value\n                    reference {\n                      ... on MediaImage {\n                        id\n                        image {\n                          url\n                          altText\n                          width\n                          height\n                        }\n                      }\n                    }\n                  }\n                }\n                ... on MediaImage {\n                  id\n                  image {\n                    url\n                    altText\n                    width\n                    height\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n      references(first: 50) {\n        nodes {\n          ... on Metaobject {\n            id\n            handle\n            type\n            fields {\n              key\n              value\n              reference {\n                ... on MediaImage {\n                  id\n                  image {\n                    url\n                    altText\n                    width\n                    height\n                  }\n                }\n                ... on Metaobject {\n                  id\n                  handle\n                  type\n                  fields {\n                    key\n                    value\n                    reference {\n                      ... on MediaImage {\n                        id\n                        image {\n                          url\n                          altText\n                          width\n                          height\n                        }\n                      }\n                    }\n                    references(first: 20) {\n                      nodes {\n                        ... on Metaobject {\n                          id\n                          handle\n                          type\n                          fields {\n                            key\n                            value\n                            reference {\n                              ... on MediaImage {\n                                id\n                                image {\n                                  url\n                                  altText\n                                  width\n                                  height\n                                }\n                              }\n                            }\n                          }\n                        }\n                        ... on MediaImage {\n                          id\n                          image {\n                            url\n                            altText\n                            width\n                            height\n                          }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n              references(first: 50) {\n                nodes {\n                  ... on Metaobject {\n                    id\n                    handle\n                    type\n                    fields {\n                      key\n                      value\n                      reference {\n                        ... on MediaImage {\n                          id\n                          image {\n                            url\n                            altText\n                            width\n                            height\n                          }\n                        }\n                      }\n                    }\n                  }\n                  ... on MediaImage {\n                    id\n                    image {\n                      url\n                      altText\n                      width\n                      height\n                    }\n                  }\n                }\n              }\n            }\n          }\n          ... on MediaImage {\n            id\n            image {\n              url\n              altText\n              width\n              height\n            }\n          }\n        }\n      }\n    }\n  }\n\n  fragment HeroSliderMetaobject on Metaobject {\n    id\n    handle\n    type\n    fields {\n      key\n      value\n      reference {\n        ... on MediaImage {\n          id\n          image {\n            url\n            altText\n            width\n            height\n          }\n        }\n        ... on Collection {\n          id\n          handle\n          title\n        }\n        ... on Metaobject {\n          id\n          handle\n          type\n          fields {\n            key\n            value\n            reference {\n              ... on MediaImage {\n                id\n                image {\n                  url\n                  altText\n                  width\n                  height\n                }\n              }\n              ... on Metaobject {\n                id\n                handle\n                type\n                fields {\n                  key\n                  value\n                  reference {\n                    ... on MediaImage {\n                      id\n                      image {\n                        url\n                        altText\n                        width\n                        height\n                      }\n                    }\n                    ... on Metaobject {\n                      id\n                      handle\n                      type\n                      fields {\n                        key\n                        value\n                        reference {\n                          ... on MediaImage {\n                            id\n                            image {\n                              url\n                              altText\n                              width\n                              height\n                            }\n                          }\n                        }\n                      }\n                    }\n                  }\n                  references(first: 50) {\n                    nodes {\n                      ... on Metaobject {\n                        id\n                        handle\n                        type\n                        fields {\n                          key\n                          value\n                          reference {\n                            ... on MediaImage {\n                              id\n                              image {\n                                url\n                                altText\n                                width\n                                height\n                              }\n                            }\n                          }\n                        }\n                      }\n                      ... on MediaImage {\n                        id\n                        image {\n                          url\n                          altText\n                          width\n                          height\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n            references(first: 50) {\n              nodes {\n                ... on Metaobject {\n                  id\n                  handle\n                  type\n                  fields {\n                    key\n                    value\n                    reference {\n                      ... on MediaImage {\n                        id\n                        image {\n                          url\n                          altText\n                          width\n                          height\n                        }\n                      }\n                    }\n                  }\n                }\n                ... on MediaImage {\n                  id\n                  image {\n                    url\n                    altText\n                    width\n                    height\n                  }\n                }\n              }\n            }\n          }\n        }\n        ... on Collection {\n          id\n          handle\n          title\n          image {\n            url\n            altText\n            width\n            height\n          }\n        }\n        ... on Product {\n          id\n          handle\n          title\n          featuredImage {\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n      references(first: 50) {\n        nodes {\n          ...HeroSliderSlideFields\n          ... on MediaImage {\n            id\n            image {\n              url\n              altText\n              width\n              height\n            }\n          }\n          ... on Collection {\n            id\n            handle\n            title\n            image {\n              url\n              altText\n              width\n              height\n            }\n          }\n          ... on Product {\n            id\n            handle\n            title\n            featuredImage {\n              url\n              altText\n              width\n              height\n            }\n          }\n        }\n      }\n    }\n  }\n\n  query HomePageHeroSlider($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    heroSliderMetaobject: metaobject(handle: {handle: "hero-slider", type: "home_page"}) {\n      ...HeroSliderMetaobject\n    }\n    homePageBannerMetaobject: metaobject(handle: {handle: "home-page-banner", type: "home_page"}) {\n      ...HeroSliderMetaobject\n    }\n    ourBenefitsMetaobject: metaobject(handle: {handle: "our-benefits", type: "home_page"}) {\n      ...HeroSliderMetaobject\n    }\n    festiveEditMetaobject: metaobject(handle: {handle: "festive-edit", type: "home_page"}) {\n      ...HeroSliderMetaobject\n    }\n    homePageMetaobjects: metaobjects(type: "home_page", first: 25) {\n      nodes {\n        ...HeroSliderMetaobject\n      }\n    }\n  }\n': {
    return: HomePageHeroSliderQuery;
    variables: HomePageHeroSliderQueryVariables;
  };
  '#graphql\n  query StorefrontCustomerOrder($orderId: ID!, $customerAccessToken: String!) {\n    customer(customerAccessToken: $customerAccessToken) {\n      orders(first: 250, reverse: true) {\n        nodes {\n          id\n        }\n      }\n    }\n    order: node(id: $orderId) {\n      ... on Order {\n        id\n        name\n        processedAt\n        statusUrl\n        fulfillmentStatus\n        subtotalPrice {\n          amount\n          currencyCode\n        }\n        totalTax {\n          amount\n          currencyCode\n        }\n        totalPrice {\n          amount\n          currencyCode\n        }\n        shippingAddress {\n          name\n          formatted\n          formattedArea\n        }\n        discountApplications(first: 10) {\n          nodes {\n            value {\n              __typename\n              ... on MoneyV2 {\n                amount\n                currencyCode\n              }\n              ... on PricingPercentageValue {\n                percentage\n              }\n            }\n          }\n        }\n        lineItems(first: 100) {\n          nodes {\n            title\n            quantity\n            originalTotalPrice {\n              amount\n              currencyCode\n            }\n            discountedTotalPrice {\n              amount\n              currencyCode\n            }\n            variant {\n              id\n              title\n              price {\n                amount\n                currencyCode\n              }\n              image {\n                url\n                altText\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: StorefrontCustomerOrderQuery;
    variables: StorefrontCustomerOrderQueryVariables;
  };
  '#graphql\n  query getCustomerOrders($customerAccessToken: String!, $first: Int) {\n    customer(customerAccessToken: $customerAccessToken) {\n      orders(first: $first) {\n        nodes {\n          id\n          name\n          orderNumber\n          processedAt\n          financialStatus\n          fulfillmentStatus\n          totalPrice {\n            amount\n            currencyCode\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n': {
    return: GetCustomerOrdersQuery;
    variables: GetCustomerOrdersQueryVariables;
  };
  '#graphql\n  query LocationPickerAddresses($customerAccessToken: String!) {\n    customer(customerAccessToken: $customerAccessToken) {\n      addresses(first: 20) {\n        nodes {\n          id\n          firstName\n          lastName\n          address1\n          city\n          zip\n        }\n      }\n    }\n  }\n': {
    return: LocationPickerAddressesQuery;
    variables: LocationPickerAddressesQueryVariables;
  };
  '#graphql\n  query PredictiveSearch(\n    $query: String!\n    $limit: Int\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    predictiveSearch(\n      query: $query\n      limit: $limit\n      limitScope: ALL\n      types: [QUERY, PRODUCT, COLLECTION]\n    ) {\n      queries {\n        text\n      }\n      products {\n        id\n        title\n        handle\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n        featuredImage {\n          url\n          altText\n        }\n      }\n      collections {\n        id\n        title\n        handle\n        image {\n          url\n          altText\n        }\n      }\n    }\n  }\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
  '#graphql\n  query FavouriteProductVariants(\n    $ids: [ID!]!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    nodes(ids: $ids) {\n      ... on Product {\n        id\n        variants(first: 100) {\n          nodes {\n            id\n            title\n            availableForSale\n            price {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: FavouriteProductVariantsQuery;
    variables: FavouriteProductVariantsQueryVariables;
  };
  '#graphql\n  query Article(\n    $articleHandle: String!\n    $blogHandle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    blog(handle: $blogHandle) {\n      handle\n      articleByHandle(handle: $articleHandle) {\n        handle\n        title\n        contentHtml\n        publishedAt\n        author: authorV2 {\n          name\n        }\n        image {\n          id\n          altText\n          url\n          width\n          height\n        }\n        seo {\n          description\n          title\n        }\n      }\n    }\n  }\n': {
    return: ArticleQuery;
    variables: ArticleQueryVariables;
  };
  '#graphql\n  query Blog(\n    $language: LanguageCode\n    $blogHandle: String!\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(language: $language) {\n    blog(handle: $blogHandle) {\n      title\n      handle\n      seo {\n        title\n        description\n      }\n      articles(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ArticleItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n\n      }\n    }\n  }\n  fragment ArticleItem on Article {\n    author: authorV2 {\n      name\n    }\n    contentHtml\n    handle\n    id\n    image {\n      id\n      altText\n      url\n      width\n      height\n    }\n    publishedAt\n    title\n    blog {\n      handle\n    }\n  }\n': {
    return: BlogQuery;
    variables: BlogQueryVariables;
  };
  '#graphql\n  query Blogs(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    blogs(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      nodes {\n        title\n        handle\n        seo {\n          title\n          description\n        }\n      }\n    }\n  }\n': {
    return: BlogsQuery;
    variables: BlogsQueryVariables;
  };
  '#graphql\n  query CartPageOfferBannerMetaobject {\n    metaobjects(type: "cart_offer_banner", first: 1) {\n      nodes {\n        fields {\n          key\n          reference {\n            ... on MediaImage {\n              image {\n                url\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: CartPageOfferBannerMetaobjectQuery;
    variables: CartPageOfferBannerMetaobjectQueryVariables;
  };
  '#graphql\n  query CartRecommendedProducts($first: Int!) {\n    products(first: $first) {\n      nodes {\n        id\n        title\n        handle\n        vendor\n        featuredImage {\n          id\n          url\n          altText\n          width\n          height\n        }\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n        variants(first: 10) {\n          nodes {\n            id\n            title\n            availableForSale\n            price {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: CartRecommendedProductsQuery;
    variables: CartRecommendedProductsQueryVariables;
  };
  '#graphql\n  query CartProductRecommendations($productId: ID!) {\n    productRecommendations(productId: $productId) {\n      id\n      title\n      handle\n      vendor\n      productType\n      availableForSale\n      featuredImage {\n        url\n        altText\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n        maxVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n      variants(first: 10) {\n        nodes {\n          id\n          title\n          availableForSale\n          price {\n            amount\n            currencyCode\n          }\n          compareAtPrice {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n  }\n': {
    return: CartProductRecommendationsQuery;
    variables: CartProductRecommendationsQueryVariables;
  };
  '#graphql\n  query GetCollectionProducts(\n    $handle: String!\n    $first: Int!\n    $after: String\n    $filters: [ProductFilter!]\n    $sortKey: ProductCollectionSortKeys\n    $reverse: Boolean\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      seo {\n        title\n        description\n      }\n      image {\n        url\n      }\n      standardCategoryBanner: metafield(namespace: "custom", key: "standard_category_banner_mob") {\n        type\n        reference {\n          ... on MediaImage {\n            image {\n              url\n              altText\n              width\n              height\n            }\n          }\n        }\n      }\n      products(\n        first: $first\n        after: $after\n        filters: $filters\n        sortKey: $sortKey\n        reverse: $reverse\n      ) {\n        filters {\n          id\n          label\n          type\n          presentation\n          values {\n            id\n            label\n            count\n            input\n            swatch {\n              color\n              image {\n                previewImage {\n                  url\n                }\n              }\n            }\n          }\n        }\n        nodes {\n          id\n          handle\n          title\n          description\n          availableForSale\n          vendor\n          productType\n          tags\n          featuredImage {\n            url\n            altText\n            width\n            height\n          }\n          images(first: 6) {\n            nodes {\n              id\n              altText\n              url\n              width\n              height\n            }\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n            maxVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n          variants(first: 100) {\n            nodes {\n              id\n              title\n              sku\n              availableForSale\n              price {\n                amount\n                currencyCode\n              }\n              compareAtPrice {\n                amount\n                currencyCode\n              }\n              selectedOptions {\n                name\n                value\n              }\n              image {\n                url\n                altText\n                width\n                height\n              }\n            }\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n': {
    return: GetCollectionProductsQuery;
    variables: GetCollectionProductsQueryVariables;
  };
  '#graphql\n  fragment Collection on Collection {\n    id\n    title\n    handle\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n  }\n  query StoreCollections(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collections(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      nodes {\n        ...Collection\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n': {
    return: StoreCollectionsQuery;
    variables: StoreCollectionsQueryVariables;
  };
  '#graphql\n  query Catalog(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {\n      nodes {\n        ...CollectionItem\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n    search(query: "", first: 1, types: PRODUCT) {\n      productFilters {\n        id\n        label\n        type\n        presentation\n        values {\n          id\n          label\n          count\n          input\n          swatch {\n            color\n            image {\n              previewImage {\n                url\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n  #graphql\n  fragment MoneyCollectionItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment CollectionItem on Product {\n    id\n    handle\n    title\n    vendor\n    productType\n    tags\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 6) {\n      nodes {\n        id\n        altText\n        url\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyCollectionItem\n      }\n      maxVariantPrice {\n        ...MoneyCollectionItem\n      }\n    }\n    compareAtPriceRange {\n      minVariantPrice {\n        ...MoneyCollectionItem\n      }\n      maxVariantPrice {\n        ...MoneyCollectionItem\n      }\n    }\n  }\n\n': {
    return: CatalogQuery;
    variables: CatalogQueryVariables;
  };
  '#graphql\n  query SearchCatalog(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n    $searchTerm: String!\n    $productFilters: [ProductFilter!]\n  ) @inContext(country: $country, language: $language) {\n    search(\n      query: $searchTerm\n      first: $first\n      last: $last\n      before: $startCursor\n      after: $endCursor\n      productFilters: $productFilters\n      types: PRODUCT\n    ) {\n      totalCount\n      productFilters {\n        id\n        label\n        type\n        presentation\n        values {\n          id\n          label\n          count\n          input\n          swatch {\n            color\n            image {\n              previewImage {\n                url\n              }\n            }\n          }\n        }\n      }\n      nodes {\n        ... on Product {\n          ...CollectionItem\n        }\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n  #graphql\n  fragment MoneyCollectionItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment CollectionItem on Product {\n    id\n    handle\n    title\n    vendor\n    productType\n    tags\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 6) {\n      nodes {\n        id\n        altText\n        url\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyCollectionItem\n      }\n      maxVariantPrice {\n        ...MoneyCollectionItem\n      }\n    }\n    compareAtPriceRange {\n      minVariantPrice {\n        ...MoneyCollectionItem\n      }\n      maxVariantPrice {\n        ...MoneyCollectionItem\n      }\n    }\n  }\n\n': {
    return: SearchCatalogQuery;
    variables: SearchCatalogQueryVariables;
  };
  '#graphql\n  query Page(\n    $language: LanguageCode,\n    $country: CountryCode,\n    $handle: String!\n  )\n  @inContext(language: $language, country: $country) {\n    page(handle: $handle) {\n      handle\n      id\n      title\n      body\n      seo {\n        description\n        title\n      }\n      metafields(identifiers: [\n        {namespace: "custom", key: "subtitle"},\n        {namespace: "custom", key: "banner_desktop"},\n        {namespace: "custom", key: "banner_mobile"},\n        {namespace: "custom", key: "rates_table"},\n        {namespace: "custom", key: "faqs"},\n        {namespace: "custom", key: "benefits_list"},\n        {namespace: "custom", key: "terms_content"}\n      ]) {\n        key\n        namespace\n        value\n        type\n        reference {\n          ... on MediaImage {\n            image {\n              url\n              altText\n              width\n              height\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {\n    body\n    handle\n    id\n    title\n    url\n  }\n  query Policy(\n    $country: CountryCode\n    $language: LanguageCode\n    $privacyPolicy: Boolean!\n    $refundPolicy: Boolean!\n    $shippingPolicy: Boolean!\n    $termsOfService: Boolean!\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      privacyPolicy @include(if: $privacyPolicy) {\n        ...Policy\n      }\n      shippingPolicy @include(if: $shippingPolicy) {\n        ...Policy\n      }\n      termsOfService @include(if: $termsOfService) {\n        ...Policy\n      }\n      refundPolicy @include(if: $refundPolicy) {\n        ...Policy\n      }\n    }\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n  fragment PolicyItem on ShopPolicy {\n    id\n    title\n    handle\n  }\n  query Policies ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    shop {\n      privacyPolicy {\n        ...PolicyItem\n      }\n      shippingPolicy {\n        ...PolicyItem\n      }\n      termsOfService {\n        ...PolicyItem\n      }\n      refundPolicy {\n        ...PolicyItem\n      }\n      subscriptionPolicy {\n        id\n        title\n        handle\n      }\n    }\n  }\n': {
    return: PoliciesQuery;
    variables: PoliciesQueryVariables;
  };
  '#graphql\n  query RegularSearch(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $term: String!\n    $startCursor: String\n    $productFilters: [ProductFilter!]\n    $sortKey: SearchSortKeys\n    $reverse: Boolean\n  ) @inContext(country: $country, language: $language) {\n    articles: search(\n      query: $term,\n      types: [ARTICLE],\n      first: $first,\n    ) {\n      nodes {\n        ...on Article {\n          ...SearchArticle\n        }\n      }\n    }\n    pages: search(\n      query: $term,\n      types: [PAGE],\n      first: $first,\n    ) {\n      nodes {\n        ...on Page {\n          ...SearchPage\n        }\n      }\n    }\n    products: search(\n      after: $endCursor,\n      before: $startCursor,\n      first: $first,\n      last: $last,\n      query: $term,\n      productFilters: $productFilters,\n      sortKey: $sortKey,\n      reverse: $reverse,\n      types: [PRODUCT],\n      unavailableProducts: HIDE,\n    ) {\n      productFilters {\n        id\n        label\n        type\n        presentation\n        values {\n          id\n          label\n          count\n          input\n          swatch {\n            color\n            image {\n              previewImage {\n                url\n              }\n            }\n          }\n        }\n      }\n      nodes {\n        ...on Product {\n          ...SearchProduct\n        }\n      }\n      pageInfo {\n        ...PageInfoFragment\n      }\n    }\n  }\n  #graphql\n  fragment SearchProduct on Product {\n    __typename\n    handle\n    id\n    publishedAt\n    title\n    trackingParameters\n    vendor\n    productType\n    tags\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 6) {\n      nodes {\n        id\n        altText\n        url\n        width\n        height\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    selectedOrFirstAvailableVariant {\n      id\n      title\n      availableForSale\n      price {\n        amount\n        currencyCode\n      }\n      compareAtPrice {\n        amount\n        currencyCode\n      }\n      selectedOptions {\n        name\n        value\n      }\n      image {\n        url\n        altText\n        width\n        height\n      }\n    }\n    variants(first: 100) {\n      nodes {\n        id\n        title\n        sku\n        availableForSale\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        image {\n          url\n          altText\n          width\n          height\n        }\n      }\n    }\n  }\n\n  #graphql\n  fragment SearchPage on Page {\n     __typename\n     handle\n    id\n    title\n    trackingParameters\n  }\n\n  #graphql\n  fragment SearchArticle on Article {\n    __typename\n    handle\n    id\n    title\n    trackingParameters\n  }\n\n  #graphql\n  fragment PageInfoFragment on PageInfo {\n    hasNextPage\n    hasPreviousPage\n    startCursor\n    endCursor\n  }\n\n': {
    return: RegularSearchQuery;
    variables: RegularSearchQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
