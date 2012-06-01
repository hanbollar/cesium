/*global define*/
define([
        '../../Core/DeveloperError',
        '../../Shaders/Materials/RefractionMapMaterial'
    ], function(
        DeveloperError,
        ShadersRefractionMapMaterial) {
    "use strict";

    /**
     *
     * The refraction map works by refracting the world-space view
     * vector off of the surface normal using the two indices of
     * refraction. The refracted vector samples a cube map.
     *
     * @name RefractionMapMaterial
     * @constructor
     */
    function RefractionMapMaterial(template) {
        var t = template || {};

        /**
         * RGB Cube map texture
         */
        this.cubeMap = t.cubeMap;

        /**
         * Index of refraction ratio is refractiveIndex1 / refractiveIndex2.
         * For example, if the ray is going between air and water the value is
         * (refractiveIndexAir / refractiveIndexWater), or (1.0 / 1.33)
         */
        this.indexOfRefractionRatio = t.indexOfRefractionRatio;

        var that = this;
        this._uniforms = {
            u_cubeMap : function() {
                if (typeof that.cubeMap === 'undefined') {
                    throw new DeveloperError("Refraction cube map required.");
                }
                return that.cubeMap;
            },
            u_indexOfRefractionRatio : function() {
                return that.indexOfRefractionRatio;
            }
        };
    }

    RefractionMapMaterial.prototype._getShaderSource = function() {
        return "#line 0\n" + ShadersRefractionMapMaterial;
    };

    return RefractionMapMaterial;
});

