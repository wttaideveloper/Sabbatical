import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsCustomBlock extends Struct.ComponentSchema {
  collectionName: 'components_sections_custom_blocks';
  info: {
    description: 'A flexible, admin-added content block appended to the end of a page';
    displayName: 'Custom Section Block';
  };
  attributes: {
    attribution: Schema.Attribute.String;
    backgroundColor: Schema.Attribute.String;
    blockType: Schema.Attribute.Enumeration<['text', 'cta', 'quote', 'video']> &
      Schema.Attribute.DefaultTo<'text'>;
    body: Schema.Attribute.RichText;
    ctaHref: Schema.Attribute.String;
    ctaLabel: Schema.Attribute.String;
    fontFamily: Schema.Attribute.Enumeration<
      ['montserrat', 'playfair', 'lora', 'cormorant', 'inter']
    >;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    layout: Schema.Attribute.Enumeration<
      ['image-left', 'image-right', 'image-top', 'text-only']
    > &
      Schema.Attribute.DefaultTo<'image-right'>;
    textColor: Schema.Attribute.String;
    videoUrl: Schema.Attribute.String;
  };
}

export interface SharedListItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_list_items';
  info: {
    description: 'A reusable numbered/titled item used in grids, checklists, and feature lists across the site';
    displayName: 'List Item';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    note: Schema.Attribute.String;
    number: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'sections.custom-block': SectionsCustomBlock;
      'shared.list-item': SharedListItem;
    }
  }
}
