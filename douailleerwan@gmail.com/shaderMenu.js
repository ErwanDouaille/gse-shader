//  GNOME Shell Extension Shader
//  Copyright (C) 2016 douaille
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
//
//  Douaille Erwan <douailleerwan@gmail.com>

import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import St from 'gi://St';

import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Slider from 'resource:///org/gnome/shell/ui/slider.js';

import * as ShaderList from './shaderList.js';

export const ShaderMenu = GObject.registerClass(
  class ShaderMenu extends PanelMenu.Button {
    constructor(shaderModifier, path) {
      super(0.0, "ShaderMenu");
      this._shaderModifier = shaderModifier;
      this._path = path;

      this._shaderLister = new ShaderList.ShaderList(path);
      this._initDefaultLogo();
      this._createMenu();
    }

    _initDefaultLogo() {
      let gicon = Gio.icon_new_for_string(this._path + "/" + "logo.png");
      this._logo = new St.Icon({ gicon: gicon });
      this.add_child(this._logo);
    }

    _createMenu() {
      this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
      this._addShaderList();
      this._addSeparator();
    }

    _addSeparator() {
      let item = new PopupMenu.PopupSeparatorMenuItem('');
      this.menu.addMenuItem(item);
    }

    _addShaderList(config, output) {
      let  item = new PopupMenu.PopupMenuItem(_("Shader menu"));
      item.label.add_style_class_name('display-subtitle');
      item.reactive = false;
      item.can_focus = false;
      this.menu.addMenuItem(item);
      this._callbacks = [];
      let shaderList = this._shaderLister.getShaderList();
      for ( var i = 0; i <  shaderList.length; i++) {
        let shader  =  shaderList[i];
        let item = new PopupMenu.PopupMenuItem(shader.name);

        this._callbacks.push(() => {
          this._shaderModifier._changeShader(shader);
          this._removeSlider()
          if (this._shaderModifier.hasSlider()) this._addSlider();
          this._sliderChanged(this._slider, 0.5);
          this._slider.value = 0.5;
        });
        item.connect('activate', this._callbacks[i]);
        this.menu.addMenuItem(item);
      }
    }

    _addSlider() {
      this._item = new PopupMenu.PopupBaseMenuItem({ activate: false });
      this.menu.addMenuItem(this._item);

      this._slider = new Slider.Slider(.5);
      this._slider.connect('notify::value', () => this._sliderChanged());
      this._slider.can_focus = false;
      this._slider.value = 0.5;
      this._sliderChanged(this._slider, this._slider._value);

      let icon = new St.Icon({ icon_name: 'view-refresh',
                              style_class: 'popup-menu-icon' });
      this._item.add_child(icon);
      this._item.add_child(this._slider);
    }

    _removeSlider() {
      if (this._item) {
        this._item.destroy();
        delete this._item;
      }
    }

    _clamp(num, min, max) {
      return num < min ? min : num > max ? max : num;
    }

    _sliderChanged() {
      //clamp fixing issue with cogl
      this._shaderModifier.updateSliderValue(this._clamp(this._slider.value, 0.001, 0.999));
    }
  }
);